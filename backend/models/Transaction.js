// models/Transaction.js

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  dateOfSale: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  sold: {
    type: Boolean,
    required: true,
  },
});

// Create indexes for improved query performance
transactionSchema.index({ dateOfSale: 1 });
transactionSchema.index({ title: "text", description: "text" });
transactionSchema.index({ category: 1 });
transactionSchema.index({ price: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
