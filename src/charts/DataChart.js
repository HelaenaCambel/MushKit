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

const sampleData = [
  { name: '10:00', temp: 24, humid: 60 },
  { name: '11:00', temp: 25, humid: 58 },
  { name: '12:00', temp: 26, humid: 62 },
  { name: '01:00', temp: 27, humid: 59 },
  { name: '02:00', temp: 25, humid: 61 },
  { name: '03:00', temp: 24, humid: 63 },
  { name: '04:00', temp: 23, humid: 64 },
];

const DataChart = () => {
  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      {/* Temperature Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={sampleData}
          syncId="anyId"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="temp" stroke="#ff7300" fill="#ff7300" />
        </AreaChart>
      </ResponsiveContainer>

      {/* Humidity Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={sampleData}
          syncId="anyId"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="humid" stroke="#00b894" fill="#00b894" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
