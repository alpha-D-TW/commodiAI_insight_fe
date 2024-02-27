import React from 'react';
import _ from "lodash";

const renderTooltipItem = (item, type, options) => (
  <tr key={type}>
    {_.map(options, option => (
      <td key={option.key}>{option.render(item, type)}</td>
    ))}
  </tr>
);

const TooltipTable = ({
  hasHeader = true,
  showDataByType = true,
  options,
  payload,
  selectedTypes,
  typeSeparator = '',
}) => (
  <table className="tooltip-table">
    {hasHeader && (
      <thead>
        <tr>
          {_.map(options, item => (
            <td key={item.key}>{item.title}</td>
          ))}
        </tr>
      </thead>
    )}
    <tbody>
      {_.map(payload, item => {
        const type = typeSeparator ? _.split(_.get(item, 'dataKey'), typeSeparator)[0] : _.get(item, 'dataKey');
        return !showDataByType || (type && _.includes(selectedTypes, type))
          ? renderTooltipItem(item, type, options)
          : null;
      })}
    </tbody>
  </table>
);

export default TooltipTable;
