const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEqual, transform } = require("lodash");
const { ObjectID } = require("mongodb");

const { User, Photo, Like, Message } = require("../../models");
const bindUser = require("./bind-user");

const bindUsers = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map((user) => {
      return {
        ...user._doc,
        _id: user.id,
      };
    });
  } catch (err) {
    throw err;
  }
};

const bindMessage = async (messageIds) => {
  const messages = await Message.find({ _id: { $in: messageIds } });
  return messages.map((message) => {
    return {
      ...message._doc,
      _id: message.id,
      sender: bindUser.bind(this, message.sender),
      recipient: bindUser.bind(this, message.recipient),
    };
  });
};

const bindPhotos = async (photoIds) => {
  const photos = await Photo.find({ _id: { $in: photoIds } });
  return photos.map((photo) => {
    return {
      ...photo._doc,
      _id: photo.id,
      user: bindUser.bind(this, photo.user),
    };
  });
};

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(async (user) => {
        return {
          ...user._doc,
          _id: user.id,
          password: null,
          photos: bindPhotos.bind(this, user.photos),
          liked: bindUsers.bind(this, user.liked),
          likedby: bindUsers.bind(this, user.likedby),
          messagesSent: bindMessage.bind(this, user.messagesSent),
          messagesReceived: bindMessage.bind(this, user.messagesReceived),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  login: async ({ userName, password }) => {
    const user = await User.findOne({ userName });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return { userId: user._id, token: token, tokenExpiration: 1 };
  },
  createUser: async ({ userSaveType }) => {
    try {
      const userFound = await User.findOne({
        userName: userSaveType.userName,
      });
      if (userFound) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(userSaveType.password, 12);
      const user = new User({
        userName: userSaveType.userName,
        password: hashedPassword,
        gender: userSaveType.gender,
        dateOfBirth: userSaveType.dateOfBirth,
        knownAs: userSaveType.knownAs,
        introduction: userSaveType.introduction,
        interests: userSaveType.interests,
        lookingFor: userSaveType.lookingFor,
        city: userSaveType.city,
        country: userSaveType.country,
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
  updateUser: async ({ userUpdateType }, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const userFound = await User.findOne({
      _id: req.userId,
    });
    if (!userFound) {
      throw new Error("user doesn't exist");
    }
    if (userUpdateType.password) {
      userUpdateType.password = await bcrypt.hash(userUpdateType.password, 12);
    }

    const diffuser = transform(userUpdateType, (result, value, key) => {
      if (!isEqual(value, userFound[key])) {
        result[key] = value;
      }
    });

    const result = await User.findByIdAndUpdate(
      ObjectID(req.userId),
      { $set: diffuser },
      { new: true }
    );
    return {
      ...result._doc,
      password: null,
    };
  },
  deleteUser: async (req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const userFound = await User.findOne({
      _id: req.userId,
    });
    if (!userFound) {
      throw new Error("user doesn't exist");
    }
    // cascade delete
    const [result] = await Promise.all([
      userFound.deleteOne(),
      Photo.findOne({ user: req.userId }).deleteOne(),
      Like.findOne({ likedby: req.userId }).deleteOne(),
      Like.findOne({ liked: req.userId }).deleteOne(),
      Message.findOne({ sender: req.userId }).deleteOne(),
      Message.findOne({ recipient: req.userId }).deleteOne(),
    ]);
    return result ? true : false;
  },
};
