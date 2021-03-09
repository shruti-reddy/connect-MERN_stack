const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEqual, transform } = require("lodash");
const { ObjectID } = require("mongodb");

const { User, Photo, Like, Message } = require("../../models");
const bindUser = require("./bind-user");
const { errorName } = require('../../constants')

const bindUsers = async (userIds) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    return users.map((user) => {
      return {
        ...user._doc,
        _id: user.id,
        photos: bindPhotos.bind(this, user.photos),
        liked: bindLikes.bind(this, user.liked),
        likedby: bindLikes.bind(this, user.likedby),
        messagesSent: bindMessage.bind(this, user.messagesSent),
        messagesReceived: bindMessage.bind(this, user.messagesReceived),
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

const bindLikes = async (userIds) => {
  return {
    count: userIds.length,
    likes: bindUsers.bind(this, userIds),
  };
};

const bindPhotos = async (photoIds, args) => {
  const where = {
    _id: { $in: photoIds },
  };
  if (args.isMain !== undefined) {
    where.isMain = args.isMain;
  }
  const photos = await Photo.find(where);
  return photos.map((photo) => {
    return {
      ...photo._doc,
      _id: photo.id,
      user: bindUser.bind(this, photo.user),
    };
  });
};

module.exports = {
  users: async (args) => {
    const userId = args ? args.userId : "";
    let where = { _id: { $ne: '6046ec56d415140022c0b17c' } };
    if (userId) {
      where = {
        _id: userId,
      };
    }
    try {
      const users = await User.find(where);
      return users.map(async (user) => {
        return {
          ...user._doc,
          _id: user.id,
          password: null,
          photos: bindPhotos.bind(this, user.photos),
          liked: bindLikes.bind(this, user.liked),
          likedby: bindLikes.bind(this, user.likedby),
          messagesSent: bindMessage.bind(this, user.messagesSent),
          messagesReceived: bindMessage.bind(this, user.messagesReceived),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  login: async ({ userName, password }) => {
    try {
      const user = await User.findOne({ userName });
      if (!user) {
        throw new Error("user doesn't exist");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("password is incorrect");
      }
      const photo = await Photo.findOne({
        user: user._id,
        isMain: true,
      });
      const token = jwt.sign(
        {
          userId: user._id,
          userName: user.userName,
          userPhoto: photo ? photo.url : "",
        },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 60 }
      );
      return {
        userId: user._id,
        userName: user.userName,
        token: token,
        tokenExpiration: 1,
      };
    }
    catch (err) {
      throw err
    }
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
    if (!req.req.isAuth) {
      throw new Error("User is not authenticated");
    }
    const userFound = await User.findOne({
      _id: req.req.userId,
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
      ObjectID(req.req.userId),
      { $set: diffuser },
      { new: true }
    );
    return {
      ...result._doc,
      password: null,
      photos: bindPhotos.bind(this, userFound.photos),
      liked: bindLikes.bind(this, userFound.liked),
      likedby: bindLikes.bind(this, userFound.likedby)
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
