import React from 'react';
import { ResponsiveContainer, BarChart } from 'recharts';
import _ from "lodash";

import { renderBar, renderChartBrush, renderGrid, renderTooltip, renderXAxis, renderYAxis } from './components';

const OpxBarChart = ({
  className = '',
  config,
  chartData,
  color,
  dataKey,
  labelKey,
  xAxisTitle,
  yAxisTitle,
  onRenderTooltip,
  selectedTypes = [],
  margin = {},
  padding,
  aspect = 4,
  xTickFormatter,
  yAxisDomain,
  yAxisLabel,
  hasBrush,
  barSize,
}) => {
  const brushDataKey = _.isEmpty(config) ? dataKey : _.get(config, '[0].dataKey');
  const selectedConfig = _.filter(config, ({ type }) => _.includes(selectedTypes, type));
  return (
    <ResponsiveContainer className={className} aspect={aspect}>
      <BarChart
        margin={{ top: 20, right: 40, left: 0, bottom: 0, ...margin }}
        data={chartData}
        barCategoryGap={barSize === 'small' ? '10%' : '20%'}
        barGap={barSize === 'small' ? 1 : 2}
      >
        {renderGrid()}
        {renderXAxis({
          dataKey: labelKey,
          title: xAxisTitle,
          formatter: xTickFormatter,
          padding,
          allowDuplicatedCategory: true,
        })}
        {renderYAxis({
          title: yAxisTitle,
          padding,
          domain: yAxisDomain,
          yAxisLabel,
          allowDataOverflow: true,
        })}
        {renderTooltip(onRenderTooltip, selectedTypes, { fill: 'rgba(127, 127, 127, .2)' })}
        {_.isEmpty(selectedConfig) ? renderBar({ dataKey, color }) : _.map(selectedConfig, renderBar)}
        {hasBrush &&
          brushDataKey &&
          renderChartBrush({
            labelKey,
            dataKey: brushDataKey,
            data: chartData,
            formatter: xTickFormatter,
            domain: yAxisDomain,
          })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OpxBarChart;
