const { User, Like } = require("../../models");

const bindUser = require("./bind-user");

module.exports = {
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
  likeUser: async (args, req) => {
    if (!req.isAuth || !req.userId) {
      throw new Error("User is not authenticated");
    }
    try {
      const likeFound = await Like.findOne({
        liked: args.recipientId,
      });
      if (likeFound) {
        throw new Error("you already liked this user");
      }
      const like = new Like({
        liked: args.recipientId,
        likedby: req.userId,
      });
      const user = await User.findById(req.userId);
      user.liked.push(args.recipientId);
      console.log(user);
      await user.save();
      const result = await like.save();

      const likeeUser = await User.findById(args.recipientId);
      likeeUser.likedby.push(req.userId);
      console.log(likeeUser);
      await likeeUser.save();
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
  unLikeUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    try {
      const likeFound = await Like.findOne({
        liked: args.recipientId,
      });
      if (!likeFound) {
        throw new Error("you did not like this user");
      }
      const result = await likeFound.deleteOne();

      const user = await User.findById(req.userId);
      user.liked = user.liked.filter((like) => like !== args.recipientId);
      await user.save();

      const likeeUser = await User.findById(args.recipientId);
      likeeUser = likeeUser.likedby.filter((like) => like !== req.userId);
      await likeeUser.save();

      return result ? true : false;
    } catch (err) {
      throw err;
    }
  },
};
