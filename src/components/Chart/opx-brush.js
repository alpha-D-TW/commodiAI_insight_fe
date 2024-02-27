import React from 'react';
import { Brush } from 'recharts';

class OpxBrush extends Brush {
  renderText() {
    const { startIndex, endIndex, y, height, travellerWidth, stroke, width } = this.props;
    const { startX, endX } = this.state;
    const minTextWidth = 100;
    const offset = 5;
    const attrs = {
      pointerEvents: 'none',
      fill: stroke,
    };

    const startTextPos = Math.min(startX, endX);
    const endTextPos = Math.max(startX, endX) + travellerWidth;

    return (
      <g className="recharts-brush-texts">
        <text
          textAnchor={startTextPos > minTextWidth ? 'end' : 'start'}
          x={startTextPos > minTextWidth ? startTextPos : startTextPos + travellerWidth}
          y={y + height / 2}
          dx={startTextPos > minTextWidth ? -offset : offset}
          dy={4}
          {...attrs}
        >
          {this.getTextOfTick(startIndex)}
        </text>
        <text
          textAnchor={width > endTextPos ? 'start' : 'end'}
          x={width > endTextPos ? endTextPos : endTextPos - travellerWidth}
          y={y + height / 2}
          dx={width > endTextPos ? offset : -offset}
          dy={4}
          {...attrs}
        >
          {this.getTextOfTick(endIndex)}
        </text>
      </g>
    );
  }
}

export default OpxBrush;
