const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  likerId: { type: String, required: true },
  likeeId: { type: String, required: true },
  liker: { type: Schema.Types.ObjectId, ref: "User" },
  likee: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Like", likeSchema);
