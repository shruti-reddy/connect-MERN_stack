const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  recipientId: { type: String, required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  dateRead: { type: String },
  messageSent: { type: String, default: new Date() },
  senderDeleted: { type: Boolean, default: false },
  recipientDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", messageSchema);
