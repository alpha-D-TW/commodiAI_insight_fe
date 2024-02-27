import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import _ from "lodash";

import ChartTooltip from '../Chart/chart-tooltip';
import { CHAT_CHART_TYPE, DATE_DIMENSION } from './chartUtils';
import {
  formatDateStrToLocale,
  formatFloatToLocaleWithDecimal,
  formatStr2Month,
  MONTH_DATE_FORMAT
} from '../../utils/formatter';
import { isPositiveInt } from '../../utils/validator';
import {LANGUAGES} from "../../constants";

const ChatChartTooltip = ({ selectedTypes, dimension, chartType, ...props }) => {
  const {
    i18n: { language },
  } = useTranslation();

  const formatMonthDateStrToLocale = label => {
    const date = dayjs(label, MONTH_DATE_FORMAT);
    if (date.isValid()) {
      return language === LANGUAGES.CN ? date.format('MM月DD日') : date.format('MMM DD');
    }
    return label || '-';
  };

  const renderTrendTitle = label => {
    if (dimension === DATE_DIMENSION.YEAR) {
      return language === LANGUAGES.CN ? `${label}年` : label;
    }
    if (dimension === DATE_DIMENSION.WEEK) {
      const year = _.split(label, '-')[0];
      const week = _.split(label, '-')[1];
      if (isPositiveInt(year) && isPositiveInt(week)) {
        return language === LANGUAGES.CN ? `${year}年第${week}周` : `Week ${week}, ${year}`;
      }
    }
    if (dimension === DATE_DIMENSION.MONTH) {
      const year = _.split(label, '-')[0];
      const month = _.split(label, '-')[1];
      if (isPositiveInt(year) && isPositiveInt(month)) {
        const monthAbbr = formatStr2Month(month);
        return language === LANGUAGES.CN ? `${year}年${monthAbbr}` : `${monthAbbr}, ${year}`;
      }
    }
    return formatDateStrToLocale(label) || '-';
  };

  const renderYearsTitle = label => {
    if (isPositiveInt(label)) {
      if (dimension === DATE_DIMENSION.WEEK) {
        return language === LANGUAGES.CN ? `第${label}周` : `Week ${label}`;
      }
      if (dimension === DATE_DIMENSION.MONTH) {
        return formatStr2Month(label);
      }
    }
    return formatMonthDateStrToLocale(label);
  };

  return (
    <ChartTooltip
      {...props}
      selectedTypes={selectedTypes}
      formatValueFn={formatFloatToLocaleWithDecimal}
      formatTitleFn={chartType === CHAT_CHART_TYPE.YEARS ? renderYearsTitle : renderTrendTitle}
    />
  );
};

export default ChatChartTooltip;
