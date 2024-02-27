import React from 'react';

const CustomizedAxisLabel = ({ isYAxis, viewBox = {}, title, yAxisLabel = {} }) => {
  const { width = 0, height = 0, x = 0, y = 0 } = viewBox;
  const { dx = -8, dy = 0 } = yAxisLabel || {};
  if (title) {
    return (
      <text
        x={x + width}
        y={isYAxis ? y : height / 2 + y}
        dx={dx}
        dy={dy}
        textAnchor={isYAxis ? 'end' : 'start'}
        fill="#888"
      >
        {title}
      </text>
    );
  }
  return null;
};

export default CustomizedAxisLabel;
