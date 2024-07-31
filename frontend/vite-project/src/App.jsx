// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [combinedData, setCombinedData] = useState(null);
  console.log(combinedData);

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chart/combined?month=${selectedMonth}`
        );
        setCombinedData(response.data);
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };

    fetchCombinedData();
  }, [selectedMonth]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Transaction Dashboard
      </h1>
      <div className="mb-6">
        <label
          htmlFor="month-select"
          className="block mb-2 font-semibold text-gray-700"
        >
          Select Month:
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="w-full md:w-64"
        >
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {new Date(2000, index).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TransactionsTable selectedMonth={selectedMonth} />
        {combinedData && (
          <>
            <Statistics data={combinedData.statistics} />
            <BarChart data={combinedData.barChart} />
            <PieChart data={combinedData.pieChart} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
