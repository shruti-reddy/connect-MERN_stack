const userSchema = require("./user");
const photoSchema = require("./photo");
const likeSchema = require("./like");
const messageSchema = require("./message");

const rootSchema = {
  ...messageSchema,
  ...likeSchema,
  ...photoSchema,
  ...userSchema,
};

module.exports = rootSchema;
