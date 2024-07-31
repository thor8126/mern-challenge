// routes/transactions.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET /api/transactions
router.get("/", async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const query = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
      },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: parseFloat(search) || 0 },
      ];
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      transactions,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
