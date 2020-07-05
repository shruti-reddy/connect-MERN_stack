const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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
    input SendMessageType{
        recipientId: ID!,
        content:String
    }
    type RootQuery{
        messages: [Message!]
    }
    type RootMutation{
        sendMessage(sendMessageType: SendMessageType): Message
        readMessage(messageId: ID!): Message
        deleteMessage(messageId: ID!): Message  
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
