const graphql = require('graphql');
const axios  = require('axios');
const {
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} = graphql;

const hostUrl = "http://localhost:3000";

const PhotoType = new GraphQLObjectType({
    name: 'Photo',
    fields: () =>({
        id: { type: GraphQLString},
        url: { type: GraphQLString},
        description: { type: GraphQLString},
        dataAdded: { type: GraphQLString},
        isMain: { type: GraphQLBoolean},
        publicId: { type: GraphQLString},
        user: {
            type: UserType,
            resolve(parentValue, args){
                console.log(parentValue);
                return axios.get(`${hostUrl}/users/${parentValue.userId}`)
                    .then( res => res.data);
            }
        }
    })
})

const UserSaveType =  new GraphQLInputObjectType({
    name: 'UserSave',
    fields: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        gender: { type:  new GraphQLNonNull(GraphQLString) },
        dateOfBirth: { type:  new GraphQLNonNull(GraphQLString) },
        knownAs: { type: GraphQLString },
        introduction: { type: GraphQLString },
        lookingFor: { type: GraphQLString },
        interests: { type: GraphQLString },
        city: { type:  new GraphQLNonNull(GraphQLString) },
        country: { type:  new GraphQLNonNull(GraphQLString) }
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ()=>({
        id: { type: GraphQLString },
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
            resolve(parentValue, args){
                console.log(parentValue);
                return axios.get(`${hostUrl}/users/${parentValue.id}/photos`)
                    .then(res => res.data);
            }
        },
        likers: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                 return axios.get(`${hostUrl}/users/1`)
                    .then(res => res.data);
            } 
        },
        likees: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                 return axios.get(`${hostUrl}/users/1`)
                    .then(res => res.data);
            } 
        },
        messagesSent: {
            type: new GraphQLList(MessageType),
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/messages/1`)
                   .then(res => res.data);
            }
        },
        messagesReceived: {
            type: new GraphQLList(MessageType),
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/messages/1`)
                   .then(res => res.data);
            }
        }
    })
});

const LikeType = new GraphQLObjectType({
    name: 'Like',
    fields: () =>({
        liker: {
            type: UserType,
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/users/1`)
                   .then(res => res.data);
           } 
        },
        likee: {
            type: UserType,
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/users/1`)
                   .then(res => res.data);
           } 
        }
    })
})

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () =>({
        id: { type: GraphQLString },
        sender: { type: UserType },
        recipient: { type: UserType },
        content: { type: GraphQLString },
        isRead: { type: GraphQLBoolean },
        dateRead: { type: GraphQLString },
        messageSent: { type: GraphQLString },
        senderDeleted: { type: GraphQLBoolean },
        recipientDeleted: { type: GraphQLBoolean } 
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                console.log(parentValue);
                return axios.get(`${hostUrl}/users/${args.id}`)
                    .then(res => res.data);
            }
        },
        photo: {
            type: PhotoType,
            args: {id: {type: GraphQLString } },
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/photos/${args.id}`)
                    .then( res => res.data);
            }
        },
        like: {
            type: LikeType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/likes/${args.id}`)
                    .then( res => res.data);
            }
        },
        message: {
            type: MessageType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`${hostUrl}/messages/${args.id}`)
                    .then( res => res.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: { user: { type: UserSaveType} },
            resolve(parentValue, args){
                return axios.post(`${hostUrl}/users`, args.user)
                    .then(res => res.data);
            }
        },
        addPhoto: {
            type: UserType,
            args: { userId: {type: new GraphQLNonNull(GraphQLString) }, url: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, args){
                return axios.post(`${hostUrl}/photos`, args)
                    .then(res => res.data);
            }
        },
        addLike: {
            type: LikeType,
            args: { userId: {type: new GraphQLNonNull(GraphQLString) }, recipientId: {type: new GraphQLNonNull(GraphQLString) }},
            resolve(parentValue, args){
                const data = {
                    likerId: args.userId,
                    likeeId: args.recipientId
                };
                return axios.post(`${hostUrl}/likes`, data)
                    .then(res => res.data);
            }
        },
        addMessage: {
            type: UserType,
            args: { userId: {type: new GraphQLNonNull(GraphQLString) }, recipientId: {type: new GraphQLNonNull(GraphQLString)}, content: {type: new GraphQLNonNull(GraphQLString)}},
            resolve(parentValue, args){
                return axios.post(`${hostUrl}/messages`, args)
                    .then(res => res.data);
            }
        },
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});