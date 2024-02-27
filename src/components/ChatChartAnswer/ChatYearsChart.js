import { Empty } from 'antd';
import dayjs from 'dayjs';
import _ from "lodash";

import { CHART_TYPE } from '../../constants/chart';
import OpxSelectableChart from '../Chart';
import { DARK_RED, getColorByIndex } from '../../constants/palette';
import {
  CHAT_CHART_TYPE, DATE_PERIOD,
  getDateDimension,
  getDateInterval,
  mapDataByYearsPeriod
} from './chartUtils';
import ChartTitle from './ChartTitle';
import styles from './chart.module.scss';
import ChatChartTooltip from './ChatChartTooltip';
import {isNotEmptyArray, parseStrToFloatWithDecimal} from "../../utils/formatter";

const ChatYearsChart = ({ data: { allYears, data, columns, period, dateColumn, sheetUnit }, chartType }) => {
  const isBarChart = chartType === CHAT_CHART_TYPE.SEASONS || period === DATE_PERIOD.QUARTERLY;
  const currentYear = dayjs().year();
  const dimension = getDateDimension(period, CHAT_CHART_TYPE.YEARS);
  const updatedDate = dateColumn && _.last(data) ? _.last(data)[dateColumn] : null;
  const dataByPeriod = isNotEmptyArray(allYears) ? mapDataByYearsPeriod(data, columns, allYears, dimension) : [];

  const getChartData = (currentData) => {
    if (chartType === CHAT_CHART_TYPE.WEEK_AVERAGE) {
      return  _.map(currentData, item => {
        const beforeData = _.filter(currentData, dataItem => dataItem.week <= item.week);
        return _.reduce(
          allYears,
          (sum, year) => ({
            ...sum,
            [year]:
              item[year] > 0
                ? parseStrToFloatWithDecimal(_.sumBy(beforeData, bd => bd[year] || 0) / item.week) || null
                : null,
          }),
          item,
        );
      });
    }
    return currentData
  }

  const renderYearsChart = (column, unit) => {
    const currentData = _.filter(dataByPeriod, item => item.dataKey === column);
    if (isNotEmptyArray(currentData)) {
      const configs = _.map(allYears, (item, index) => ({
        dataKey: item.toString(),
        title: item.toString(),
        type: item.toString(),
        value: item.toString(),
        color: item === currentYear ? DARK_RED : getColorByIndex(index),
        ignoreTranslation: true,
      }));
      return (
        <OpxSelectableChart
          hasBrush={!isBarChart}
          disableDateDomainSelect
          chartType={isBarChart ? CHART_TYPE.BAR : CHART_TYPE.LINE}
          padding={{ left: 0, right: isBarChart ? 0 : 20, top: 20 }}
          aspect={1.5}
          config={configs}
          types={configs}
          labelKey={dimension}
          chartData={getChartData(currentData)}
          xAxisInterval={getDateInterval(dimension)}
          yAxisTitle={unit || sheetUnit}
          yAxisLabel={{ dx: 10, dy: -8 }}
          optionSize="small"
          barSize="small"
          onRenderTooltip={(props, selectedTypes) => (
            <ChatChartTooltip
              {...props}
              selectedTypes={selectedTypes}
              dimension={dimension}
              chartType={CHAT_CHART_TYPE.YEARS}
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
        {renderYearsChart(column, unit)}
      </div>
    );
  };

  return _.map(columns, renderContent);
};

export default ChatYearsChart;
