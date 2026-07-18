import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({

  id: Number,

  companyName: String,

  ownerName: String,

  email: String,

  password: String,

  location: String,

  wallet: String,

  materials: Array,

  trusted: {
    type: Boolean,
    default: true
  },

  trustScore: {
    type: Number,
    default: 95
  }

});

export default mongoose.model(
  "Supplier",
  supplierSchema
);