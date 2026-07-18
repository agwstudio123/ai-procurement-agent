import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: Number,
  senderRole: String,
  senderName: String,
  text: String,
  type: String,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  orderId: Number,
  messages: [messageSchema],
});

export default mongoose.model("Chat", chatSchema);