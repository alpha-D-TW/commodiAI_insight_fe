import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import {
    DATE_FORMAT,
    isNotEmptyArray,
    isNumber,
    MONTH_DATE_FORMAT,
    parseStrToFloatWithDecimal,
    parseStrToInt,
} from '../../utils/formatter';
import _ from "lodash";

dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);

export const DATE_PERIOD = {
    MONTHLY: 'monthly',
    WEEKLY: 'weekly',
    DAILY: 'daily',
    DAYS_10: '10days',
    YEARLY: 'yearly',
    QUARTERLY: 'quarterly'
};

export const DATE_DIMENSION = {
    YEAR: 'year',
    MONTH: 'month',
    WEEK: 'week',
    DATE: 'date',
    QUARTER: 'quarter',
    TREND_DATE: 'trendDate',
};

export const CHAT_CHART_TYPE = {
    TREND: 'trend',
    YEARS: 'years',
    SEASONS: 'seasons',
    WEEK_AVERAGE: 'week_average',
    CANDLE: 'candle'
};

export const mapChartTypes = (singleData) => {
    if (singleData?.columns.length === 4) {
        return CHAT_CHART_TYPE.CANDLE
    }
    const result = _.filter(singleData?.chartTypes, item => _.values(CHAT_CHART_TYPE).includes(item));
    return isNotEmptyArray(result) ? result : [CHAT_CHART_TYPE.TREND, CHAT_CHART_TYPE.YEARS];
};

const parseDate = (dateStr, period) => {
    if (dateStr) {
        if (period === DATE_PERIOD.QUARTERLY) {
            const yearIndex = dateStr.indexOf("年")
            const year = parseStrToInt(yearIndex > 0 ? dateStr.substring(0, yearIndex) : null)
            const quarter = parseStrToInt(dateStr.substring(dateStr.indexOf("第") + 1, dateStr.indexOf("季度"),))
            return 2000 <= year && year <= 2100 && 1 <= quarter && quarter <= 4 ? {
                year,
                quarter,
                date: `${year}Q${quarter}`,
                trendDate: dayjs().quarter(quarter - 1).year(year).date(1).format(DATE_FORMAT),
            } : null
        }
        const date = dayjs(dateStr, period === DATE_PERIOD.DAILY ? "YYYY年M月D日" : DATE_PERIOD.YEARLY ? "YYYY年" : "YYYY年M月");
        if (date.isValid()) {
            return period === DATE_PERIOD.YEARLY
                ? {
                    year: date.year(),
                    date: date.year(),
                    trendDate: date.year(),
                }
                : {
                    year: date.year(),
                    month: date.month() + 1,
                    date: date.format(MONTH_DATE_FORMAT),
                    trendDate: date.format(DATE_FORMAT),
                };
        }
    }
    return null;
};

const getYearsDataForDataKey = (data, dataKey, allYears, dateKey, periodValue) =>
    _.reduce(
        allYears,
        (sum, year) => ({...sum, [year]: parseStrToFloatWithDecimal(_.get(data, `${year}[0].${dataKey}`)) || null}),
        {
            dataKey,
            [dateKey]: isNumber(periodValue) ? parseInt(periodValue, 10) : periodValue,
        },
    );

export const getDateInterval = dimension => {
    switch (dimension) {
        case DATE_DIMENSION.MONTH:
            return 0;
        case DATE_DIMENSION.WEEK:
            return 3;
        default:
            return 'preserveStart';
    }
};

export const getDateDimension = (period, chartType) => {
    if (chartType === CHAT_CHART_TYPE.YEARS && period === DATE_PERIOD.QUARTERLY) {
        return DATE_DIMENSION.QUARTER
    }
    switch (period) {
        case DATE_PERIOD.MONTHLY:
            return DATE_DIMENSION.MONTH;
        case DATE_PERIOD.WEEKLY:
            return DATE_DIMENSION.WEEK;
        case DATE_PERIOD.YEARLY:
            return DATE_DIMENSION.YEAR;
        default:
            return chartType === CHAT_CHART_TYPE.YEARS ? DATE_DIMENSION.DATE : DATE_DIMENSION.TREND_DATE;
    }
};

const getChartData = (data, dateColumn, period) =>
    _.orderBy(
        _.filter(
            _.map(data, item => ({
                ...item,
                ...parseDate(item[dateColumn], period),
            })),
            item => item.year,
        ),
        'trendDate',
        'asc',
    );

export const mapDataToChart = (data, dateColumn, columns, period) => {
    const availableData = getChartData(data, dateColumn, period);
    const allYears = _.uniq(_.map(availableData, item => item.year)).sort();
    return {
        years: isNotEmptyArray(allYears) ? allYears : null,
        data: availableData,
    };
};

export const mapDataByYearsPeriod = (data, columns, allYears, dateKey) => {
    const periodData = _.mapValues(_.groupBy(data, dateKey), v => _.groupBy(v, 'year'));
    const result = _.reduce(
        periodData,
        (sum, value, key) => {
            const yearData = _.map(columns, col => getYearsDataForDataKey(value, col.column, allYears, dateKey, key));
            return _.concat(sum, yearData);
        },
        [],
    );
    return _.orderBy(result, dateKey, 'asc');
};

export const mapDataByYearsComparison = (data, columns, allYears, dateKey) => {
    return _.map(allYears, year => {
        const yearData = _.find(data, item => item && item[dateKey] === year)
        return _.reduce(columns, (sum, col) => ({
            ...sum,
            [col.column]: parseStrToFloatWithDecimal(yearData && yearData[col.column]) || null
        }), {year})
    })
}

const getColumnsValue = (data, columnKeys, dateKey) =>
    _.reduce(
        columnKeys,
        (sum, col) => ({
            ...sum,
            [col]: parseStrToFloatWithDecimal(_.get(data, `[0].${col}`)) || null,
        }),
        {
            trendDate: dateKey,
        },
    );

export const mapDataByTrendPeriod = (data, columnKeys, dateKey) => {
    const periodData = _.groupBy(data, item => `${item.year}-${_.padStart(item[dateKey], 2, '0')}`);
    return _.values(_.mapValues(periodData, (item, key) => getColumnsValue(item, columnKeys, key)));
};
