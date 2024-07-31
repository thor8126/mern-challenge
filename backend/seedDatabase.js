// seedDatabase.js

const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

// Import your Transaction model
const Transaction = require("./models/Transaction");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Fetch data from the provided URL
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data;

    // Transform the data to match our schema
    const formattedTransactions = transactions.map((transaction) => ({
      title: transaction.title,
      description: transaction.description,
      price: transaction.price,
      dateOfSale: new Date(transaction.dateOfSale),
      category: transaction.category,
      sold: transaction.sold,
      // You can add more fields here if needed
    }));

    // Insert the data into the database
    await Transaction.insertMany(formattedTransactions);
    console.log(
      `${formattedTransactions.length} transactions inserted successfully`
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
