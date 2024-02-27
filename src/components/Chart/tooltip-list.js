import React from 'react';
import _ from "lodash";

import { EMPTY_PLACEHOLDER } from '../../constants';

const renderTooltipItem = ({ key, title, render }, value) => (
  <li key={key}>
    <span>{title}:&nbsp;&nbsp;</span>
    <span>{render ? render(value) : value || EMPTY_PLACEHOLDER}</span>
  </li>
);

const TooltipList = ({ options, payload, style }) => (
  <ul className="tooltip-list" style={style}>
    {_.map(options, item => {
      const value = payload && payload[item.key] ? payload[item.key] : null;
      return item.hideEmpty && !value ? null : renderTooltipItem(item, value);
    })}
  </ul>
);

export default TooltipList;
