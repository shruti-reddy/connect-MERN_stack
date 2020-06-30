const graphql = require("graphql");
const {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = graphql;

const { User, Photo, Like, Message } = require("../models");

const PhotoType = new GraphQLObjectType({
  name: "Photo",
  fields: () => ({
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    dateAdded: { type: GraphQLString },
    isMain: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.userId })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
  }),
});

const UserSaveType = new GraphQLInputObjectType({
  name: "UserSave",
  fields: {
    userName: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: new GraphQLNonNull(GraphQLString) },
    dateOfBirth: { type: new GraphQLNonNull(GraphQLString) },
    knownAs: { type: GraphQLString },
    introduction: { type: GraphQLString },
    lookingFor: { type: GraphQLString },
    interests: { type: GraphQLString },
    city: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const PhotoSaveType = new GraphQLInputObjectType({
  name: "PhotoSave",
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    isMain: { type: GraphQLBoolean },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    userName: { type: GraphQLString },
    gender: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    knownAs: { type: GraphQLString },
    created: { type: GraphQLString },
    lastActive: { type: GraphQLString },
    introduction: { type: GraphQLString },
    lookingFor: { type: GraphQLString },
    interests: { type: GraphQLString },
    city: { type: GraphQLString },
    country: { type: GraphQLString },
    photos: {
      type: new GraphQLList(PhotoType),
      resolve(parentValue, args) {
        return Photo.find({ userId: parentValue._id })
          .then((res) => {
            return res.map((r) => {
              return { ...r._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    liked: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return Like.find({ likerId: parentValue._id })
          .then((res) => {
            const likees = res.map((like) => like.likeeId);
            return User.find({ _id: { $in: likees } })
              .then((res) => {
                return res.map((r) => {
                  return { ...r._doc };
                });
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    likedBy: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return Like.find({ likeeId: parentValue._id })
          .then((res) => {
            const likers = res.map((like) => like.likerId);
            return User.find({ _id: { $in: likers } })
              .then((res) => {
                return res.map((r) => {
                  return { ...r._doc };
                });
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    messagesSent: {
      type: new GraphQLList(MessageType),
      resolve(parentValue, args) {
        return Message.find({ senderId: parentValue._id })
          .then((res) => {
            return res.map((r) => {
              return { ...r._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    messagesReceived: {
      type: new GraphQLList(MessageType),
      resolve(parentValue, args) {
        return Message.find({ recipientId: parentValue._id })
          .then((res) => {
            return res.map((r) => {
              return { ...r._doc };
            });
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
  }),
});

const LikeType = new GraphQLObjectType({
  name: "Like",
  fields: () => ({
    liker: {
      type: UserType,
      resolve(parentValue, args) {
        return User.aggregate([
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "likerId",
              as: likers,
            },
          },
        ]).exec((err, likers) => {
          console.log(likers);
        });
      },
    },
    likee: {
      type: UserType,
      resolve(parentValue, args) {
        return User.aggregate([
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "likeeId",
              as: likers,
            },
          },
        ]).exec((err, likers) => {
          console.log(likers);
        });
      },
    },
  }),
});

const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    sender: {
      type: UserType,
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.senderId })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    recipient: {
      type: UserType,
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.recipientId })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    content: { type: GraphQLString },
    isRead: { type: GraphQLBoolean },
    dateRead: { type: GraphQLString },
    messageSent: { type: GraphQLString },
    senderDeleted: { type: GraphQLBoolean },
    recipientDeleted: { type: GraphQLBoolean },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return User.findOne({ _id: args.id })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    photo: {
      type: PhotoType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Photo.findOne({ _id: args.id })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    like: {
      type: LikeType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Like.findOne({ _id: args.id })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    message: {
      type: MessageType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Message.findOne({ _id: args.id })
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { user: { type: UserSaveType } },
      resolve(parentValue, args) {
        const user = new User(args.user);
        return user
          .save()
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    addPhoto: {
      type: PhotoType,
      args: { photo: { type: PhotoSaveType } },
      resolve(parentValue, args) {
        const photo = new Photo(args.photo);
        return photo
          .save()
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    addLike: {
      type: LikeType,
      args: {
        likerId: { type: new GraphQLNonNull(GraphQLString) },
        likeeId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        const like = new Like(args);
        return like
          .save()
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    addMessage: {
      type: MessageType,
      args: {
        senderId: { type: new GraphQLNonNull(GraphQLString) },
        recipientId: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        const message = new Message(args);
        return message
          .save()
          .then((res) => {
            return { ...res._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
