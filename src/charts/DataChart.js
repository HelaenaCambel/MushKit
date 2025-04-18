import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: '10:00', uv: 4000, pv: 2400 },
  { name: '11:00', uv: 3000, pv: 1398 },
  { name: '12:00', uv: 2000, pv: 9800 },
  { name: '01:00', uv: 2780, pv: 3908 },
  { name: '02:00', uv: 1890, pv: 4800 },
  { name: '03:00', uv: 2390, pv: 3800 },
  { name: '04:00', uv: 3490, pv: 4300 },
];

const DataChart = () => {
  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
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
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>

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
          <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
