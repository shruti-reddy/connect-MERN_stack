const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");
const path = require("path");

const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
const graphQLSchema = require("./graphql/schema");
const graphQLResolver = require("./graphql/resolvers");

var app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@connect-jo5xp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const { errorType } = require('./constants')

const getErrorCode = errorName => {
  return errorType[errorName]
}

app.use(
  "/graphql", (req, res) => {
    expressGraphQL({
      schema: graphQLSchema,
      rootValue: graphQLResolver,
      graphiql: true,
      context: { req },
    })(req, res)
  });

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Listening on PORT 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
