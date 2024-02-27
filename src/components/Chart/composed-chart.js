import React from 'react';
import { ComposedChart, ResponsiveContainer } from 'recharts';
import _ from "lodash";

import { CHART_LINE_TYPE } from '../../constants/chart';
import {
  renderAreaColor,
  renderChartBrush,
  renderGrid,
  renderHideableArea,
  renderHideableBar,
  renderHideableLine,
  renderHideableScatter,
  renderTooltip,
  renderXAxis,
  renderYAxis,
} from './components';
import {isNotEmptyArray} from "../../utils/formatter";

const OpxComposedChart = ({
  margin = {},
  aspect = 4,
  labelKey,
  chartData,
  onRenderTooltip,
  xAxisTitle,
  yAxisTitle,
  xAxisLabel,
  selectedTypes,
  className = '',
  config,
  xTickFormatter,
  yAxisConfig,
  hasBrush,
  yAxisDomain,
}) => {
  const brushDataKey = _.get(config, '[0].dataKey');
  return (
    <ResponsiveContainer className={className} aspect={aspect} minWidth={800}>
      <ComposedChart margin={{ top: 20, right: 40, left: 0, bottom: 0, ...margin }} data={chartData}>
        {renderAreaColor()}
        {renderGrid()}
        {renderXAxis({
          dataKey: labelKey,
          title: xAxisTitle,
          formatter: xTickFormatter,
          allowDuplicatedCategory: true,
          xAxisLabel,
        })}
        {isNotEmptyArray(yAxisConfig)
          ? _.map(yAxisConfig, item =>
              renderYAxis({
                ...item,
                yAxisId: item?.id,
              }),
            )
          : renderYAxis({
              title: yAxisTitle,
              domain: yAxisDomain,
            })}
        {renderTooltip(onRenderTooltip, selectedTypes)}
        {_.map(config, item => {
          switch (item.lineType) {
            case CHART_LINE_TYPE.AREA:
              return renderHideableArea(item, selectedTypes);
            case CHART_LINE_TYPE.BAR:
              return renderHideableBar(item, selectedTypes);
            case CHART_LINE_TYPE.SCATTER:
              return renderHideableScatter(item, selectedTypes);
            default:
              return renderHideableLine(item, selectedTypes);
          }
        })}
        {hasBrush &&
          brushDataKey &&
          renderChartBrush({
            labelKey,
            dataKey: brushDataKey,
            data: chartData,
            formatter: xTickFormatter,
            domain: yAxisDomain,
          })}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default OpxComposedChart;
