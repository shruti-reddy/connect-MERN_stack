const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");

var app = express();
app.use(bodyParser.json());
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@connect-jo5xp.mongodb.net/connect?retryWrites=true&w=majority`;

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(4000, () => {
      console.log("Listening on PORT 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
