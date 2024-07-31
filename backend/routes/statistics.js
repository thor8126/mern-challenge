// routes/statistics.js

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    // set year to 2022
    startDate.setFullYear(2022);

    const stats = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] },
          },
          totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          totalNotSoldItems: {
            $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] },
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }

    res.json({
      totalSaleAmount: stats[0].totalSaleAmount,
      totalSoldItems: stats[0].totalSoldItems,
      totalNotSoldItems: stats[0].totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
