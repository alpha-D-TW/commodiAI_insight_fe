import React from 'react';
import { LineChart, ResponsiveContainer } from 'recharts';
import _ from "lodash";

import { LINE_CHART_DEFAULT_COLOR } from '../../constants/palette';
import {
  renderChartBrush,
  renderGrid,
  renderHideableLine,
  renderLine,
  renderTooltip,
  renderXAxis,
  renderYAxis,
} from './components';
import styles from './index.module.scss';
import {isNotEmptyArray} from "../../utils/formatter";

const OpxLineChart = ({
  className = '',
  config,
  chartData,
  color = LINE_CHART_DEFAULT_COLOR,
  dataKey,
  dataName,
  labelKey,
  xAxisTitle,
  yAxisTitle,
  onRenderTooltip,
  onRenderLabel,
  selectedTypes = [],
  margin = {},
  padding,
  aspect = 4,
  hasBrush = false,
  xTickFormatter,
  yTickFormatter,
  xAxisInterval = null,
  xAxisDx,
  yAxisLabel,
  yAxisDomain,
  onRenderCustomTick,
  yAxisTicks,
}) => {
  const brushDataKey = _.isEmpty(config) ? dataKey : _.get(config, '[0].dataKey');
  return (
    <ResponsiveContainer className={`${styles.container} ${className}`} aspect={aspect} minWidth={350} minHeight={100}>
      <LineChart margin={{ top: 20, right: 40, left: 0, bottom: 0, ...margin }} data={chartData}>
        {renderGrid()}
        {renderXAxis({
          dataKey: labelKey,
          title: xAxisTitle,
          formatter: xTickFormatter,
          padding,
          interval: xAxisInterval,
          xAxisDx,
          onRenderCustomTick,
        })}
        {renderYAxis({
          title: yAxisTitle,
          padding,
          yAxisLabel,
          ticks: yAxisTicks,
          domain: yAxisDomain,
          formatter: yTickFormatter,
        })}
        {renderTooltip(onRenderTooltip, selectedTypes)}
        {isNotEmptyArray(config)
          ? _.map(config, item => renderHideableLine(item, selectedTypes))
          : renderLine({ dataKey, title: dataName, color, onRenderLabel })}
        {hasBrush &&
          brushDataKey &&
          renderChartBrush({
            labelKey,
            dataKey: brushDataKey,
            data: chartData,
            formatter: xTickFormatter,
            domain: yAxisDomain,
          })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OpxLineChart;
