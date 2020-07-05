const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Photo{
        _id: ID!
        url: String!
        description: String!
        dateAdded: String
        isMain: Boolean
        user: User!
    }
    input PhotoSaveType{
        url: String!
        description: String!
    }
    type RootQuery{
        photos(isMain : Boolean): [Photo!]
    }
    type RootMutation{
        addPhoto(photoSaveType: PhotoSaveType) : Photo
        setMainPhoto(_id: ID!) : Photo
        deletePhoto(_id: ID!) : Boolean
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }
`);
