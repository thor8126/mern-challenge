import React from "react";

const Statistics = ({ data }) => {
  return (
    <div className="card">
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Total Sale Amount</h3>
            <p className="text-2xl">${data.totalSaleAmount.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold">Total Sold Items</h3>
            <p className="text-2xl">{data.totalSoldItems}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold">Total Not Sold Items</h3>
            <p className="text-2xl">{data.totalNotSoldItems}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
