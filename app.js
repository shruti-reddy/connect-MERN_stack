const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");

const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
const graphQLSchema = require("./graphql/schema");
const graphQLResolver = require("./graphql/resolvers");

var app = express();

app.use(bodyParser.json());
app.use(isAuth);

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@connect-jo5xp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

app.post("/login", (req, res) => {
  console.log("Login Call");
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true,
  })
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Listening on PORT 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
