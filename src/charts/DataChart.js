import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const transformHistoryData = (data) => {
  return data.map(entry => ({
    name: entry.timestamp?.split(' ')[1] || '',

    temp: typeof entry.temperature === 'number'
      ? entry.temperature
      : parseFloat(entry.temperature) || 0,

    humid: typeof entry.humidity === 'number'
      ? entry.humidity
      : parseFloat(entry.humidity) || 0
  }));
};

const DataChart = ({ historyData }) => {
  const chartData = transformHistoryData(historyData).reverse();
  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      {/* Temperature Chart */}
      <h4 className="chart-title">Temperature</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          syncId="anyId"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
          <YAxis tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Area type="monotone" dataKey="temp" stroke="#ff7300" fill="#ff7300" />
        </AreaChart>
      </ResponsiveContainer>

      {/* Humidity Chart */}
      <h4 className="chart-title">Humidity</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          syncId="anyId"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
          <YAxis tick={{ fontSize: 12 }}/>
          <Tooltip />
          <Area type="monotone" dataKey="humid" stroke="#00b894" fill="#00b894" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
