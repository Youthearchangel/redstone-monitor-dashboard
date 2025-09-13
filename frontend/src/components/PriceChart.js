import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data, token }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{token} Price Comparison</h3>
        <p>No data available</p>
      </div>
    );
  }

  const chartData = data.map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString(),
    redstone: log.redstonePrice,
    other: log.otherPrice,
    discrepancy: log.discrepancy
  }));

  return (
    <div className="chart-container">
      <h3>{token} Price Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              name === 'redstone' || name === 'other' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`,
              name === 'redstone' ? 'Redstone' : name === 'other' ? 'CoinGecko' : 'Discrepancy'
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="redstone" 
            stroke="#ff6b6b" 
            strokeWidth={2}
            name="Redstone"
          />
          <Line 
            type="monotone" 
            dataKey="other" 
            stroke="#4ecdc4" 
            strokeWidth={2}
            name="CoinGecko"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
