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
        photos(isMain: Boolean):  [Photo!]
        liked: LikeReturn
        likedby: LikeReturn
        messagesSent : [Message!]
        messagesReceived: [Message!]
    }
    type LikeReturn {
        count: Int!
        likes : [User!]
    }
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        userName: String!
    }
    type Photo{
        _id: ID!
        url: String!
        description: String!
        dateAdded: String!
        isMain: Boolean!
        user: User!
    }
    type Like{
        liked: User!
        likedby: User!
    }
    type Message{
        sender: User!
        recipient: User!
        content: String!
        isRead: Boolean
        dateRead: String
        messageSent: String
        senderDeleted: Boolean
        recipientDeleted: Boolean
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
    input PhotoSaveType{
        url: String!
        description: String!
    }
    input SendMessageType{
        recipientId: ID!,
        content:String
    }
    type RootQuery{
        users(userId: String): [User!]!
        photos(userId: String!): [Photo!]
        likes: [Like!]
        messages: [Message!]
        login(userName: String!, password: String!): AuthData!
    }
    type RootMutation{
        createUser(userSaveType: UserSaveType) : User
        updateUser(userUpdateType: UserUpdateType) : User
        deleteUser : Boolean
        addPhoto(photoSaveType: PhotoSaveType) : Photo
        setMainPhoto(_id: ID!) : Photo
        deletePhoto(_id: ID!) : Boolean
        likeUser(recipientId : ID!) : Like
        unLikeUser(recipientId: ID!): Boolean
        sendMessage(sendMessageType: SendMessageType): Message
        readMessage(messageId: ID!): Message
        deleteMessage(messageId: ID!): Message  
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
