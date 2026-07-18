import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id: Number,
  userId: Number,
  role: String,
  type: String,
  orderId: Number,
  message: String,
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Notification",
  notificationSchema
);