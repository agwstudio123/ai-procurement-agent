import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  id: Number,
  userId: {
    type: Number,
    index: true,
  },
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

notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Notification",
  notificationSchema
);