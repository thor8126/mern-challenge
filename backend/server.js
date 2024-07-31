// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes
app.use("/api/transactions", require("./routes/transaction"));
app.use("/api/statistics", require("./routes/statistics"));
app.use("/api/chart", require("./routes/chart"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
