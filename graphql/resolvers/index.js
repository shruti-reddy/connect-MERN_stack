const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Photo = require("../../models/photo");
const Like = require("../../models/like");
const Message = require("../../models/message");

const bindUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
        };
      });
    } catch (err) {
      throw err;
    }
  },
  photos: async () => {
    try {
      const photos = await Photo.find();
      return photos.map((photo) => {
        return {
          ...photo._doc,
          _id: photo.id,
          user: bindUser.bind(this, photo.user),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  likes: async () => {
    try {
      const likes = await Like.find();
      return likes.map((like) => {
        return {
          ...like._doc,
          _id: like.id,
          liked: bindUser.bind(this, like.liked),
          likedby: bindUser.bind(this, like.likedby),
        };
      });
    } catch (err) {
      throw err;
    }
  },
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
  createUser: async (args) => {
    try {
      const userFound = await User.findOne({
        userName: args.userSaveType.userName,
      });
      if (userFound) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.userSaveType.password, 12);
      const user = new User({
        userName: args.userSaveType.userName,
        password: hashedPassword,
        gender: args.userSaveType.gender,
        dateOfBirth: args.userSaveType.dateOfBirth,
        knownAs: args.userSaveType.knownAs,
        introduction: args.userSaveType.introduction,
        interests: args.userSaveType.interests,
        lookingFor: args.userSaveType.lookingFor,
        city: args.userSaveType.city,
        country: args.userSaveType.country,
      });
      const result = await user.save();
      return {
        ...result._doc,
        password: null,
        _id: result.id,
      };
    } catch (err) {
      throw err;
    }
  },
  addPhoto: async (args) => {
    try {
      const photo = new Photo({
        user: args.photoSaveType.userId,
        url: args.photoSaveType.url,
        description: args.photoSaveType.description,
        isMain: args.photoSaveType.isMain,
      });
      const result = await photo.save();
      console.log(result);
      return {
        ...result._doc,
        _id: result.id,
        user: bindUser.bind(this, result.user),
      };
    } catch (err) {
      throw err;
    }
  },
  likeUser: async (args) => {
    try {
      const likeFound = await Like.findOne({
        liked: args.likeUserType.recipientId,
      });
      if (likeFound) {
        throw new Error("you already liked this user");
      }
      const like = new Like({
        liked: args.likeUserType.recipientId,
        likedby: args.likeUserType.senderId,
      });
      const result = await like.save();
      // console.log(result);
      return {
        ...result._doc,
        _id: result.id,
        liked: bindUser.bind(this, result._doc.liked),
        likedby: bindUser.bind(this, result._doc.likedby),
      };
    } catch (err) {
      throw err;
    }
  },
  sendMessage: async (args) => {
    try {
      if (args.sendMessageType.content == "") {
        throw new Error("message cannot be empty");
      }
      const message = new Message({
        sender: args.sendMessageType.senderId,
        recipient: args.sendMessageType.recipientId,
        content: args.sendMessageType.content,
        isRead: false,
      });
      const result = await message.save();
      //console.log(result);
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
};
