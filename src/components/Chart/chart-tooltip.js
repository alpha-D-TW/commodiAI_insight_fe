import React from 'react';
import _ from "lodash";

import { formatIntToLocale } from '../../utils/formatter';
import TooltipTable from './tooltip-table';

const getTooltipOptions = formatter => [
  {
    key: 'name',
    render: data => (
      <span className="tooltip-with-label">
        <span style={{ backgroundColor: _.get(data, 'stroke') || _.get(data, 'fill') }} />
        {data && data.name ? data.name : '-'}
      </span>
    ),
  },
  {
    key: 'value',
    render: data => formatter(_.get(data, 'value')),
  },
];

const ChartTooltip = ({ active, label, payload, selectedTypes, formatValueFn = formatIntToLocale, formatTitleFn }) => {
  if (active && !_.isEmpty(payload)) {
    return (
      <div className="tooltip-container">
        <div className="tooltip-title-container">
          <span className="tooltip-title">{formatTitleFn ? formatTitleFn(label) : label}</span>
        </div>
        <TooltipTable
          hasHeader={false}
          options={getTooltipOptions(formatValueFn)}
          payload={payload}
          selectedTypes={selectedTypes}
        />
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
