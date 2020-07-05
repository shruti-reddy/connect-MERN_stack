const usersResolver = require("./user");
const photosResolver = require("./photo");
const likesResolver = require("./like");
const messagesResolver = require("./message");

const rootResolver = {
  ...usersResolver,
  ...photosResolver,
  ...likesResolver,
  ...messagesResolver,
};

module.exports = rootResolver;
