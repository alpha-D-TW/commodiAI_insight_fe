import React from 'react';
import { Area, AreaChart, Bar, CartesianGrid, Line, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import _ from "lodash";

import { AREA_CHART_DEFAULT_COLOR, LINE_CHART_DEFAULT_COLOR } from '../../constants/palette';
import { formatFloatToLocale, getYAxisDomain } from '../../utils/formatter';
import CustomizedAxisLabel from './axis-label';
import CustomizedAxisTick from './axis-tick';
import OpxBrush from './opx-brush';

const getChartVisibility = (selectedTypes, lineType) => (_.includes(selectedTypes, lineType) ? 'visible' : 'hidden');

export const renderGrid = () => <CartesianGrid strokeDasharray="2 2" stroke="rgba(140, 160, 179, .4)" />;

export const renderXAxis = ({
  allowDuplicatedCategory = false,
  dataKey,
  title,
  formatter,
  padding,
  xAxisDx,
  xAxisLabel,
  onRenderCustomTick,
  ...props
}) => (
  <XAxis
    allowDuplicatedCategory={allowDuplicatedCategory}
    dataKey={dataKey}
    tickLine={false}
    axisLine={{ stroke: '#afbdca' }}
    label={<CustomizedAxisLabel title={title} yAxisLabel={xAxisLabel} />}
    padding={{ left: 0, right: 80, ...(padding || {}) }}
    tick={tickProps =>
      onRenderCustomTick ? (
        onRenderCustomTick(tickProps)
      ) : (
        <CustomizedAxisTick onFormatter={formatter} xAxisDx={xAxisDx} {...tickProps} />
      )
    }
    height={onRenderCustomTick ? 60 : 40}
    {...props}
  />
);

export const renderYAxis = ({ yAxisId = 0, title, formatter, domain, yAxisLabel, padding, ...props }) => {
  return (
    <YAxis
      allowDataOverflow={false}
      key={yAxisId}
      yAxisId={yAxisId}
      domain={domain || getYAxisDomain}
      tickLine={false}
      axisLine={{ stroke: '#afbdca' }}
      label={<CustomizedAxisLabel title={title} yAxisLabel={yAxisLabel} isYAxis />}
      padding={{ top: 40, bottom: 0, ...(padding || {}) }}
      tick={<CustomizedAxisTick isYAxis onFormatter={formatter || formatFloatToLocale} />}
      {...props}
    />
  );
};

export const renderTooltip = (
  onRenderFn,
  selectedTypes = [],
  cursorStyle = {
    stroke: 'rgba(140, 160, 179, .8)',
    strokeWidth: 2,
    strokeDasharray: '2 2',
  },
) => (
  <Tooltip
    filterNull={false}
    cursor={cursorStyle}
    content={onRenderFn ? props => onRenderFn(props, selectedTypes) : null}
  />
);

export const renderAreaColor = (config, dataKey = 'default') =>
  _.isEmpty(config) ? (
    <defs>
      <linearGradient key={dataKey} id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={AREA_CHART_DEFAULT_COLOR} stopOpacity={0.5} />
        <stop offset="100%" stopColor={AREA_CHART_DEFAULT_COLOR} stopOpacity={0} />
      </linearGradient>
    </defs>
  ) : (
    <defs>
      {_.map(config, ({ dataKey: key, color }) => (
        <linearGradient key={key} id={`area-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.5} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      ))}
    </defs>
  );

export const renderArea = ({ dataKey, color, title }) => (
  <Area
    key={dataKey}
    name={title || dataKey}
    dataKey={dataKey}
    stroke={color}
    strokeWidth={2}
    fill={`url(#area-${dataKey})`}
    dot={false}
    activeDot={{
      stroke: color,
      r: 2,
    }}
    connectNulls
    animationDuration={1000}
  />
);

export const renderHideableArea = ({ dataKey, color, title, type }, selectedTypes) => (
  <Area
    key={type || dataKey}
    dataKey={dataKey}
    name={title}
    stroke={color}
    strokeWidth={2}
    fill="url(#area-default)"
    dot={false}
    activeDot={{
      stroke: color,
      r: 2,
      visibility: getChartVisibility(selectedTypes, type),
    }}
    connectNulls
    style={{ visibility: getChartVisibility(selectedTypes, type) }}
    animationDuration={1000}
  />
);

export const renderLine = ({ dataKey, color = LINE_CHART_DEFAULT_COLOR, title, onRenderLabel = false }) => (
  <Line
    key={dataKey}
    dataKey={dataKey}
    name={title || dataKey}
    stroke={color}
    strokeWidth={2}
    fill={color}
    dot={false}
    activeDot={{
      stroke: color,
      r: 2,
    }}
    label={onRenderLabel}
    connectNulls
    animationDuration={1000}
  />
);

export const renderHideableLine = (
  { dataKey, color = LINE_CHART_DEFAULT_COLOR, renderDot, title, type, onRenderLabel = false, ...rest },
  selectedTypes,
) => (
  <Line
    key={type || dataKey}
    name={title}
    dataKey={dataKey}
    stroke={color}
    strokeWidth={2}
    fill={color}
    dot={renderDot ? props => renderDot(props) : false}
    activeDot={{
      stroke: color,
      r: 2,
      visibility: getChartVisibility(selectedTypes, type),
    }}
    connectNulls
    label={onRenderLabel}
    style={{ visibility: getChartVisibility(selectedTypes, type) }}
    animationDuration={1000}
    {...rest}
  />
);

export const renderBar = ({ type, title = '', dataKey, color = LINE_CHART_DEFAULT_COLOR, ...rest }) => (
  <Bar key={type || dataKey} name={title} dataKey={dataKey} fill={color} animationDuration={1000} {...rest} />
);

export const renderHideableBar = (
  { dataKey, color = LINE_CHART_DEFAULT_COLOR, title, type, onRenderLabel = false, ...rest },
  selectedTypes,
) => (
  <Bar
    key={type || dataKey}
    name={title}
    dataKey={dataKey}
    fill={color}
    stroke={color}
    style={{ visibility: getChartVisibility(selectedTypes, type) }}
    animationDuration={1000}
    {...rest}
  />
);

export const renderHideableScatter = (
  { dataKey, color = LINE_CHART_DEFAULT_COLOR, title, type, onRenderLabel = false, ...rest },
  selectedTypes,
) => (
  <Scatter
    key={type || dataKey}
    name={title}
    dataKey={dataKey}
    fill={color}
    style={{ visibility: getChartVisibility(selectedTypes, type) }}
    animationDuration={1000}
    {...rest}
  />
);

export const renderChartBrush = ({ labelKey, dataKey, data, formatter, domain = getYAxisDomain }) => (
  <OpxBrush
    dataKey={labelKey}
    stroke={AREA_CHART_DEFAULT_COLOR}
    fill="transparent"
    height={24}
    travellerWidth={10}
    gap={Math.ceil(data.length / 40)}
    tickFormatter={value => (formatter ? formatter(value) : value)}
  >
    <AreaChart data={data}>
      <XAxis
        allowDuplicatedCategory={false}
        dataKey={labelKey}
        axisLine={false}
        tickLine={false}
        tick={false}
        height={0}
      />
      <YAxis domain={domain} axisLine={false} tickLine={false} tick={false} width={0} />
      <Area dataKey={dataKey} connectNulls fill="#dcdbdb" style={{ opacity: 0.4 }} animationDuration={1000} />
    </AreaChart>
  </OpxBrush>
);
