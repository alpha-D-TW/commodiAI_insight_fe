import { Empty } from 'antd';
import dayjs from 'dayjs';
import _ from "lodash";

import { CHAT_CHART_TYPE, DATE_DIMENSION, getDateDimension, mapDataByTrendPeriod } from './chartUtils';
import ChartTitle from './ChartTitle';
import styles from './chart.module.scss';
import OpxSelectableChart from '../Chart';
import { CHART_TYPE } from '../../constants/chart';
import { LINE_CHART_DEFAULT_COLOR } from '../../constants/palette';
import ChatChartTooltip from './ChatChartTooltip';
import {
  DATE_FORMAT,
  isNotEmptyArray,
  parseStrToFloatWithDecimal,
  parseStrToInt,
  YEAR_MONTH_FORMAT
} from '../../utils/formatter';

const ChatTrendChart = ({ data: { data, columns, period, dateColumn, dataRangeYears, sheetUnit } }) => {
  const dimension = getDateDimension(period, CHAT_CHART_TYPE.TREND);
  const updatedDate = dateColumn && _.last(data) ? _.last(data)[dateColumn] : null;
  const availableYears = parseStrToInt(dataRangeYears) || 1;

  const getPeriodData = () => {
    if (dimension === DATE_DIMENSION.YEAR) {
      return data
    }
    const startYear = dayjs().year() - availableYears;
    const latestData = _.filter(data, item => item.year >= startYear);
    if (dimension === DATE_DIMENSION.TREND_DATE) {
      return latestData
    }
    return mapDataByTrendPeriod(
      latestData,
      _.map(columns, item => item.column),
      dimension,
    )
  }

  const periodData = getPeriodData();

  const renderTrendChart = (column, description, unit) => {
    const currentData = _.map(periodData, item => ({
      date: item.trendDate,
      [column]: parseStrToFloatWithDecimal(item && item[column]) || null,
    }));
    const firstAvailableIndex = _.findIndex(currentData, item => item[column]);
    const configs = [
      {
        lineType: CHART_TYPE.LINE,
        dataKey: column,
        title: description || column,
        type: column,
        value: column,
        color: LINE_CHART_DEFAULT_COLOR,
        ignoreTranslation: true,
      },
    ];
    if (isNotEmptyArray(currentData)) {
      return (
        <OpxSelectableChart
          hasBrush
          hasLongDateDomain={availableYears >= 5}
          disableDateDomainSelect={[DATE_DIMENSION.WEEK, DATE_DIMENSION.YEAR].includes(dimension)}
          dateFormat={dimension === DATE_DIMENSION.MONTH ? YEAR_MONTH_FORMAT : DATE_FORMAT}
          padding={{ left: 0, right: 20, top: 20 }}
          aspect={1.5}
          config={configs}
          types={configs}
          labelKey="date"
          chartData={_.slice(currentData, firstAvailableIndex)}
          xAxisInterval="preserveStart"
          yAxisTitle={unit || sheetUnit}
          yAxisLabel={{ dx: 10, dy: -8 }}
          disableSelectTypes
          optionSize="small"
          onRenderTooltip={(props, selectedTypes) => (
            <ChatChartTooltip
              {...props}
              selectedTypes={selectedTypes}
              dimension={dimension}
              chartType={CHAT_CHART_TYPE.TREND}
            />
          )}
        />
      );
    }
    return (
      <div className={styles.chart}>
        <Empty />
      </div>
    );
  };

  const renderContent = ({ column, description, unit }) => {
    return (
      <div key={column} className={styles.chart}>
        <ChartTitle dimension={dimension} title={description || column} updatedDate={updatedDate} />
        {renderTrendChart(column, description, unit)}
      </div>
    );
  };

  return _.map(columns, renderContent);
};

export default ChatTrendChart;
