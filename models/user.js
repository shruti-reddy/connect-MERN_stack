const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  knownAs: { type: String },
  created: { type: String },
  lastActive: { type: String },
  introduction: { type: String },
  lookingFor: { type: String },
  interests: { type: String },
  city: { type: String },
  country: { type: String },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  messagesSent: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  messagesReceived: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
