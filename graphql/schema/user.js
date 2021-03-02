const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User{
        _id: ID!
        userName: String!
        gender: String!
        dateOfBirth: String
        knownAs : String!
        created: String
        lastActive: String
        introduction: String
        lookingFor: String
        interests: String
        city: String
        country: String
        photos:  [Photo!]
        liked: [User!]
        likedby: [User!]
        messagesSent : [Message!]
        messagesReceived: [Message!]
    }
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
    input UserSaveType{
        userName: String!
        gender: String!
        dateOfBirth: String
        knownAs: String,
        introduction: String
        lookingFor: String
        interests: String
        city: String
        country: String
        password: String!
    }
    input UserUpdateType{
        userName: String
        gender: String
        dateOfBirth: String
        knownAs: String,
        introduction: String
        lookingFor: String
        interests: String
        city: String
        country: String
        password: String
    }
    type RootQuery{
        users: [User!]!
        login(userName: String!, password: String!): AuthData!
    }
    type RootMutation{
        createUser(userSaveType: UserSaveType) : User
        updateUser(userUpdateType: UserUpdateType) : User
        likeUser(recipientId : ID!) : Like
        unLikeUser(recipientId: ID!): Boolean 
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
