import React from 'react';
import { AreaChart, Legend, ResponsiveContainer } from 'recharts';
import _ from "lodash";

import { LINE_CHART_DEFAULT_COLOR } from '../../constants/palette';
import {
  renderArea,
  renderAreaColor,
  renderChartBrush,
  renderGrid,
  renderTooltip,
  renderXAxis,
  renderYAxis,
} from './components';

const OpxAreaChart = ({
  className = '',
  config,
  chartData,
  color = LINE_CHART_DEFAULT_COLOR,
  dataKey,
  labelKey,
  xAxisTitle,
  yAxisTitle,
  onRenderTooltip,
  yAxisDomain,
  margin = {},
  padding,
  aspect = 4,
  hasBrush = false,
  hasLegend = false,
  xTickFormatter,
}) => (
  <ResponsiveContainer className={className} aspect={aspect}>
    <AreaChart margin={{ top: 20, right: 40, left: 0, bottom: 0, ...margin }} data={chartData}>
      {renderAreaColor(config, dataKey)}
      {renderGrid()}
      {renderXAxis({
        dataKey: labelKey,
        title: xAxisTitle,
        formatter: xTickFormatter,
        padding,
      })}
      {renderYAxis({
        title: yAxisTitle,
        domain: yAxisDomain,
        padding,
      })}
      {renderTooltip(onRenderTooltip)}
      {hasLegend && (
        <Legend align="right" verticalAlign="top" iconType="circle" iconSize={12} wrapperStyle={{ top: '-20px' }} />
      )}
      {_.isEmpty(config) ? renderArea({ dataKey, color }) : _.map(config, renderArea)}
      {hasBrush &&
        renderChartBrush({
          labelKey,
          dataKey,
          data: chartData,
          formatter: xTickFormatter,
          domain: yAxisDomain,
        })}
    </AreaChart>
  </ResponsiveContainer>
);

export default OpxAreaChart;
