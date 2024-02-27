import React from 'react';

import { isNumber } from '../../utils/formatter';

const getTextAnchor = (isYAxis, orientation) => {
  if (isYAxis) {
    return orientation === 'right' ? 'start' : 'end';
  }
  return 'middle';
};

const CustomizedAxisTick = ({ x, y, payload, isYAxis, onFormatter, xAxisDx, orientation }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      dx={isNumber(xAxisDx) ? xAxisDx : 0}
      y={0}
      dy={isYAxis ? 0 : 12}
      textAnchor={getTextAnchor(isYAxis, orientation)}
      fill="#888"
    >
      {onFormatter ? onFormatter(payload.value) : payload.value}
    </text>
  </g>
);

export default CustomizedAxisTick;
