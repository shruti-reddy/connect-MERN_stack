const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Like{
        liked: User!
        likedby: User!
    }
    type RootQuery{
        likes: [Like!]
    }
    type RootMutation{
        likeUser(recipientId : ID!) : Like
        unLikeUser(recipientId: ID!): Boolean
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
