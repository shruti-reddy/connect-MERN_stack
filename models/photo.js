const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  url: { type: String, required: true },
  description: { type: String },
  dateAdded: { type: String, default: new Date() },
  isMain: { type: Boolean, default: false },
});

module.exports = mongoose.model("Photo", photoSchema);
