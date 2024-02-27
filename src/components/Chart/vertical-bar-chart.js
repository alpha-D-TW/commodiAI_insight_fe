import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { formatPercentageToDisplay } from '../../utils/formatter';

const CustomizedLabel = ({ x, y, width, height, value }) => (
  <g>
    <text x={x + width} y={y + height} dx={10} dy={2} fill="#333" textAnchor="start">
      {formatPercentageToDisplay(value)}
    </text>
  </g>
);

const VerticalBarChart = ({ data, width = 800, height = 800 }) => (
  <BarChart
    width={width}
    height={height}
    data={data}
    layout="vertical"
    margin={{
      top: 5,
      right: 100,
      left: 200,
      bottom: 5,
    }}
  >
    <defs>
      <linearGradient id="bar-color" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#2251ff" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#2251ff" stopOpacity={1} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#B9C5D1" />
    <XAxis
      type="number"
      axisLine={{ stroke: '#afbdca' }}
      tick={{ fill: '#333' }}
      tickLine={false}
      tickFormatter={v => `${v}`}
    />
    <YAxis dataKey="key" type="category" axisLine={{ stroke: '#afbdca' }} tickLine={false} tick={{ fill: '#333' }} />
    <Bar dataKey="value" fill="url(#bar-color)" barSize={6} radius={[0, 5, 5, 0]} label={<CustomizedLabel />} />
  </BarChart>
);

export default VerticalBarChart;
