const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User{
        _id: ID!
        userName: String!
        gender: String!
        dateOfBirth: String!
        knownAs : String!
        created: String
        lastActive: String
        introduction: String
        lookingFor: String
        interests: String
        city: String
        country: String
        Photos:  Photo
        liked: [User!]
        likedby: [User!]
        messagesSent : [Message!]
        messagesReceived: [Message!]
    }
    type Photo{
        _id: ID!
        url: String!
        description: String!
        dateAdded: String
        isMain: Boolean
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
    input PhotoSaveType{
        url: String!
        description: String!
        isMain: Boolean
        userId: ID! 
    }
    input LikeUserType{
        senderId: ID!
        recipientId: ID!
    }
    input SendMessageType{
        senderId: ID!,
        recipientId: ID!,
        content:String
    }
    type RootQuery{
        users: [User!]!
        photos: [Photo]
        likes: [Like]
        messages: [Message]
    }
    type RootMutation{
        createUser(userSaveType: UserSaveType) : User
        addPhoto(photoSaveType: PhotoSaveType) : Photo
        likeUser(likeUserType: LikeUserType) : Like
        sendMessage(sendMessageType: SendMessageType): Message
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
