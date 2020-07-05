const { ObjectID } = require("mongodb");
const { Message, User } = require("../../models");
const bindUser = require("./bind-user");

module.exports = {
  messages: async () => {
    try {
      const messages = await Message.find();
      return messages.map((message) => {
        return {
          ...message._doc,
          _id: message.id,
          sender: bindUser.bind(this, message.sender),
          recipient: bindUser.bind(this, message.recipient),
        };
      });
    } catch (err) {
      throw err;
    }
  },

  sendMessage: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User is not authenticated");
      }
      if (args.sendMessageType.content == "") {
        throw new Error("message cannot be empty");
      }
      const now = new Date().toISOString();
      const message = new Message({
        sender: req.userId,
        recipient: args.sendMessageType.recipientId,
        content: args.sendMessageType.content,
        messageSent: now,
      });
      const result = await message.save();
      const sentUser = await User.findById(req.userId);
      sentUser.messagesSent.push(message.id);
      await sentUser.save();

      const receivedUser = await User.findById(
        args.sendMessageType.recipientId
      );
      receivedUser.messagesReceived.push(message.id);
      await receivedUser.save();

      return {
        ...result._doc,
        _id: result.id,
        sender: bindUser.bind(this, result._doc.sender),
        recipient: bindUser.bind(this, result._doc.recipient),
      };
    } catch (err) {
      throw err;
    }
  },
  readMessage: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("User is not authenticated");
      }
      const now = new Date().toISOString();
      const result = await Message.findByIdAndUpdate(
        ObjectID(args.messageId),
        { $set: { isRead: "true", dateRead: now } },
        { new: true }
      );
      return {
        ...result._doc,
        sender: bindUser.bind(this, result._doc.sender),
        recipient: bindUser.bind(this, result._doc.recipient),
      };
    } catch (err) {
      throw err;
    }
  },
  deleteMessage: async (args, req) => {
    try {
      let updatedmessage;
      if (!req.isAuth) {
        throw new Error("User is not authenticated");
      }

      const message = await Message.findOne({ _id: args.messageId });
      console.log(message);
      if (message.recipient != req.userId) {
        message.senderDeleted = true;
        const sentUser = await User.findById(message.sender);
        sentUser.messagesSent = sentUser.messagesSent.filter(
          (msg) => msg != args.messageId
        );
        sentUser.save();
      } else {
        message.recipientDeleted = true;

        const receivedUser = await User.findById(message.recipient);
        receivedUser.messagesReceived = receivedUser.messagesReceived.filter(
          (msg) => msg != args.messageId
        );
        receivedUser.save();
      }

      if (message.senderDeleted && message.recipientDeleted) {
        const result = await message.deleteOne();
        return {
          ...result._doc,
          sender: bindUser.bind(this, result._doc.sender),
          recipient: bindUser.bind(this, result._doc.recipient),
        };
      }

      const result = await message.save();
      return {
        ...result._doc,
        sender: bindUser.bind(this, result._doc.sender),
        recipient: bindUser.bind(this, result._doc.recipient),
      };
    } catch (err) {
      throw err;
    }
  },
};
