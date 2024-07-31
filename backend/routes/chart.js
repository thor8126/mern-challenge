// routes/chart.js

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Bar Chart API
router.get("/bar", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    // set year to 2022
    startDate.setFullYear(2022);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const barChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: priceRanges.map((range) => ({
                case: {
                  $and: [
                    { $gte: ["$price", range.min] },
                    { $lt: ["$price", range.max] },
                  ],
                },
                then: `${range.min} - ${
                  range.max === Infinity ? "above" : range.max
                }`,
              })),
              default: "901 - above",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("Bar Chart Data:", barChartData);

    const formattedData = priceRanges.map((range) => {
      const matchingBucket = barChartData.find(
        (bucket) =>
          bucket._id ===
          `${range.min} - ${range.max === Infinity ? "above" : range.max}`
      );
      return {
        range:
          range.max === Infinity
            ? `${range.min} - above`
            : `${range.min} - ${range.max}`,
        count: matchingBucket ? matchingBucket.count : 0,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Error in bar chart API:", error);
    res.status(500).json({ message: error.message });
  }
});

// Pie Chart API
// Pie Chart API
router.get("/pie", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    // set year to 2022
    startDate.setFullYear(2022);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Log transactions within the date range
    const transactionsInRange = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });
    console.log("Transactions in Date Range:", transactionsInRange);

    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    console.log("Pie Chart Data:", pieChartData);

    res.json(pieChartData);
  } catch (error) {
    console.error("Error in pie chart API:", error);
    res.status(500).json({ message: error.message });
  }
});

// Combined API
router.get("/combined", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const statisticsResponse = await fetch(
      `http://localhost:${process.env.PORT}/api/statistics?month=${month}`
    );
    const barChartResponse = await fetch(
      `http://localhost:${process.env.PORT}/api/chart/bar?month=${month}`
    );
    const pieChartResponse = await fetch(
      `http://localhost:${process.env.PORT}/api/chart/pie?month=${month}`
    );

    const [statistics, barChart, pieChart] = await Promise.all([
      statisticsResponse.json(),
      barChartResponse.json(),
      pieChartResponse.json(),
    ]);

    res.json({
      statistics,
      barChart,
      pieChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
