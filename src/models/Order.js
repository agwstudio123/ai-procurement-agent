import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  id: Number,

  contractorId: Number,

  contractorName: String,

  contractorWallet: String,

  supplierId: Number,

  supplierName: String,

  supplierWallet: String,


  amount: Number,

  totalAmount: Number,

  marketPrice: Number,

  savings: Number,


  status: {
    type: String,
    default: "Pending"
  },


  paymentStatus: {
    type: String,
    default: "Unpaid"
  },


  deliveryFee: Number,


  transactionId: String,


  createdAt: String

});


export default mongoose.model(
  "Order",
  orderSchema
);