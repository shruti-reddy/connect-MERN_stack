const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  // likerId: { type: String, required: true },
  // likeeId: { type: String, required: true },
  liked: { type: Schema.Types.ObjectId, ref: "User" },
  likedby: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Like", likeSchema);
