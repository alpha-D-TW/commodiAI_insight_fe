import { useState } from 'react';
import _ from "lodash";

import OpxComposedChart from './composed-chart';
import OpxLineChart from './line-chart';
import { CHART_TYPE } from '../../constants/chart';
import OpxBarChart from './bar-chart';
import { DEFAULT_ALL_OPTION, LONG_SELECT_OPTIONS, SHORT_SELECT_OPTIONS } from './utils';
import {checkDateIsIsSameOrAfter, DATE_FORMAT, isNotEmptyArray} from '../../utils/formatter';
import DateDomainSelect from './date-domain-select';
import OpxAreaChart from './area-chart';
import styles from './index.module.scss';
import { getEndDateFromData } from '../../utils/dataHelper';
import OpxCheckboxGroup from '../OpxCheckbox/Group';
import './tooltip.scss';

const getSelectedTypes = types => _.map(types, item => item.value);

const enableSelectDateDomain = (hasBrush, labelKey) => hasBrush && labelKey === 'date';

const OpxSelectableChart = ({
  className,
  labelKey,
  chartData,
  onRenderTooltip,
  xAxisTitle,
  yAxisTitle,
  chartType = CHART_TYPE.LINE,
  aspect,
  hasBrush,
  config,
  yAxisConfig,
  margin,
  padding,
  xTickFormatter,
  yTickFormatter,
  xAxisInterval,
  xAxisDx,
  xAxisLabel,
  yAxisLabel,
  onRenderCustomTick,
  yAxisTicks,
  yAxisDomain,
  types,
  hasLongDateDomain,
  dateFormat = DATE_FORMAT,
  disableDateDomainSelect = false,
  optionSize,
  disableSelectTypes = false,
  barSize,
}) => {
  const [dateOption, setDateOption] = useState(DEFAULT_ALL_OPTION);
  const [selectedTypes, setSelectedTypes] = useState(getSelectedTypes(types));
  const renderChart = data => {
    switch (chartType) {
      case CHART_TYPE.COMPOSE:
        return (
          <OpxComposedChart
            margin={margin}
            aspect={aspect}
            className={className}
            config={config}
            chartData={data}
            labelKey={labelKey}
            onRenderTooltip={onRenderTooltip}
            selectedTypes={selectedTypes}
            yAxisDomain={yAxisDomain}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            xAxisLabel={xAxisLabel}
            xTickFormatter={xTickFormatter}
            yAxisConfig={yAxisConfig}
            hasBrush={hasBrush}
          />
        );
      case CHART_TYPE.BAR:
        return (
          <OpxBarChart
            className={className}
            aspect={aspect}
            margin={margin}
            padding={padding}
            config={config}
            chartData={data}
            labelKey={labelKey}
            onRenderTooltip={onRenderTooltip}
            selectedTypes={selectedTypes}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            yAxisLabel={yAxisLabel}
            yAxisDomain={yAxisDomain}
            xTickFormatter={xTickFormatter}
            hasBrush={hasBrush}
            barSize={barSize}
          />
        );
      case CHART_TYPE.AREA:
        return (
          <OpxAreaChart
            className={className}
            aspect={aspect}
            margin={margin}
            padding={padding}
            config={config}
            chartData={data}
            labelKey={labelKey}
            onRenderTooltip={onRenderTooltip}
            yAxisDomain={yAxisDomain}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            hasBrush={hasBrush}
            xTickFormatter={xTickFormatter}
          />
        );
      default:
        return (
          <OpxLineChart
            className={className}
            aspect={aspect}
            margin={margin}
            padding={padding}
            config={config}
            chartData={data}
            labelKey={labelKey}
            onRenderTooltip={onRenderTooltip}
            selectedTypes={selectedTypes}
            yAxisDomain={yAxisDomain}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            hasBrush={hasBrush}
            xTickFormatter={xTickFormatter}
            yTickFormatter={yTickFormatter}
            xAxisInterval={xAxisInterval}
            xAxisDx={xAxisDx}
            yAxisLabel={yAxisLabel}
            onRenderCustomTick={onRenderCustomTick}
            yAxisTicks={yAxisTicks}
          />
        );
    }
  };

  const shouldShowDateDomain = !disableDateDomainSelect && enableSelectDateDomain(hasBrush, labelKey);
  const endDate = shouldShowDateDomain ? getEndDateFromData(chartData) : '';
  const startDate = endDate && dateOption && dateOption.render ? dateOption.render(endDate, dateFormat) : '';
  const filterData = startDate
    ? _.filter(chartData, item => item && item.date && checkDateIsIsSameOrAfter(item.date, startDate, dateFormat))
    : chartData;
  return (
    <div className={styles.container}>
      {shouldShowDateDomain && (
        <DateDomainSelect
          selectOptions={hasLongDateDomain ? LONG_SELECT_OPTIONS : SHORT_SELECT_OPTIONS}
          selectedKey={dateOption.key}
          size={optionSize}
          onChange={v => setDateOption(v && v.render ? v : DEFAULT_ALL_OPTION)}
        />
      )}
      {!disableSelectTypes && isNotEmptyArray(types) && (
        <OpxCheckboxGroup
          className={styles.checkbox}
          options={types}
          defaultValue={selectedTypes}
          onChange={setSelectedTypes}
          size={optionSize}
        />
      )}
      <div>{renderChart(filterData)}</div>
    </div>
  );
};

export default OpxSelectableChart;
