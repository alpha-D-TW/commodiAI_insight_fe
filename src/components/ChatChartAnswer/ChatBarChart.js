import { Empty } from 'antd';
import _ from "lodash";

import {
  CHAT_CHART_TYPE,
  getDateDimension,
  mapDataByYearsComparison,
} from './chartUtils';
import ChartTitle from './ChartTitle';
import styles from './chart.module.scss';
import ChatChartTooltip from './ChatChartTooltip';
import {isNotEmptyArray} from "../../utils/formatter";
import OpxBarChart from "../Chart/bar-chart";

const ChatBarChart = ({ data: { allYears, data, columns, period, dateColumn, sheetUnit } }) => {
  const dimension = getDateDimension(period);
  const updatedDate = dateColumn && _.last(data) ? _.last(data)[dateColumn] : null;
  const dataByPeriod = isNotEmptyArray(allYears) ? mapDataByYearsComparison(data, columns, allYears, dimension) : [];

  const renderYearsChart = (column, unit) => {
    if (isNotEmptyArray(dataByPeriod)) {
      return (
        <OpxBarChart
          padding={{ left: 0, right: 0, top: 20 }}
          aspect={1.5}
          dataKey={column}
          labelKey={dimension}
          chartData={dataByPeriod}
          xAxisInterval={0}
          yAxisTitle={unit || sheetUnit}
          yAxisLabel={{ dx: 10, dy: -8 }}
          optionSize="small"
          barSize="small"
          onRenderTooltip={(props) => (
            <ChatChartTooltip
              {...props}
              selectedTypes={[column]}
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

export default ChatBarChart;
