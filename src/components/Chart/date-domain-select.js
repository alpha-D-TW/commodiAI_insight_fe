import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import _ from "lodash";

import './date-domain-select.scss';

const DateDomainSelect = ({ selectOptions, onChange, selectedKey, size }) => {
  const { t } = useTranslation();
  const options = selectOptions;
  const renderSelectOption = option => (
    <li key={option.key} className={`date-domain-option ${selectedKey === option.key ? 'active' : ''}`}>
      <Button type="link" onClick={() => onChange(option)} size={size}>
        {t(`label.prediction_dashboard.date_range.${option.key}`)}
      </Button>
    </li>
  );
  return <ul className="date-domain-container">{_.map(options, renderSelectOption)}</ul>;
};

export default DateDomainSelect;
