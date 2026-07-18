import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema({

  id: Number,

  companyName: String,

  ownerName: String,

  email: String,

  password: String,

  location: String,

  wallet: String,

  trustScore: {
    type: Number,
    default: 95
  }

});

export default mongoose.model(
  "Contractor",
  contractorSchema
);