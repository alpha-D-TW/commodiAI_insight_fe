import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {EMPTY_PLACEHOLDER} from '../constants';
import {isNetworkError} from './responseCode';
import _ from "lodash";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TO_NUMBER_FORMAT = 'YYYYMMDDHHmm';
export const DATE_TO_DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm';
export const YEAR_MONTH_FORMAT = 'YYYY-MM';
export const MONTH_DATE_FORMAT = 'MM-DD';
export const MONTH_FORMAT = 'MMM';

export const CHART_PERCENT_GAP = 25;


export const buildDownloadFileName = (filename, fileType, timestamp) => {
	const name = _.endsWith(filename, `.${fileType}`) ? _.replace(filename, new RegExp(`.${fileType}$`), '') : filename;
	return `${name}_${dayjs(timestamp).format(DATE_TO_NUMBER_FORMAT)}.${fileType}`;
};

const getDividerByNumLength = (value, numPosition = 2) => {
	const numLength = parseInt(value, 10).toString().length;
	return numLength > numPosition + 2 ? 10 ** (numLength - numPosition) : 100;
};

const getDividerByDiffLength = (dataMin, dataMax) => {
	const diff = Math.abs(dataMax - dataMin);
	if (diff <= 20) {
		return 1;
	}
	if (diff < 200) {
		return 10;
	}
	const firstDigit = diff.toString().slice(0, 1);
	const diffLength = diff.toString().length;
	return 10 ** (diffLength - (firstDigit > 2 ? 1 : 2));
};

const getMaxValue = (min, max) => (Math.abs(min) % 2 === Math.abs(max) % 2 ? max : max + 1);

export const getYAxisDomain = ([dataMin, dataMax]) => {
	if (isNumber(dataMin) && isNumber(dataMax)) {
		const fixedMin = Math.floor(dataMin);
		const fixedMax = Math.ceil(dataMax);
		const divider = getDividerByDiffLength(fixedMin, fixedMax);
		const minByDivider = Math.floor(fixedMin / divider);
		const maxByDiver = Math.ceil(fixedMax / divider);
		return [minByDivider * divider, getMaxValue(minByDivider, maxByDiver) * divider];
	}
	return [0, 0];
};

export const getMaxData = (value, numPosition = 2) => {
	if (isNumber(value)) {
		const divider = getDividerByNumLength(value, numPosition);
		return Math.ceil(parseInt(value, 10) / divider) * divider;
	}
	return 0;
};

export const getMinDataByDivider = (value, divider = CHART_PERCENT_GAP) =>
	isNumber(value) ? Math.floor(parseInt(value, 10) / divider) * divider : 0;

export const getMaxDataByDivider = (value, divider = CHART_PERCENT_GAP) =>
	isNumber(value) ? Math.ceil(parseInt(value, 10) / divider) * divider : 0;

const NumberRegexRule = /^[-+]?(?:\d*\.?\d+|\d+\.?\d*)$/;
export const isNumber = num => NumberRegexRule.test(num);

export const formatFloatToLocale = value => (isNumber(value) ? parseFloat(value).toLocaleString() : value || '-');

export const formatFloatToLocaleWithDecimal = (value, decimal = 2) =>
	isNumber(value)
		? _.round(value, decimal).toLocaleString(undefined, {
			minimumFractionDigits: decimal,
			maximumFractionDigits: decimal,
		})
		: value || '-';

export const formatIntToLocale = value => (isNumber(value) ? parseInt(value, 10).toLocaleString() : value || '-');

export const buildError = data => {
	if (_.has(data, 'response') && isNetworkError(_.get(data, 'response.status'))) {
		return {error: 'error.network_error', detail: ''};
	}
	if (_.has(data, 'errors.data.errors.0.msgParams.detail')) {
		return {
			error: 'error.common_detail',
			detail: _.get(data, 'errors.data.errors.0.msgParams.detail') || '',
		};
	}
	return {error: 'error.common', detail: data?.message || ''};
};

export const formatMoment2Str = (dateStr = '', dateFormat = DATE_FORMAT) => {
	if (dateStr) {
		const parsedDate = isNumber(dateStr) ? parseInt(dateStr, 10) : dateStr;
		return dayjs(parsedDate).format(dateFormat);
	}
	return dayjs().format(dateFormat);
};

export const formatStr2Weekday = dateStr => formatMoment2Str(dateStr, 'ddd');

export const formatStr2Moment = (dateStr, dateFormat = DATE_FORMAT) => {
	if (dateStr) {
		return isNumber(dateStr) ? dayjs(parseInt(dateStr, 10)) : dayjs(dateStr, dateFormat);
	}
	return dayjs();
};

export const formatStr2MonthDate = dateStr => formatStr2Moment(dateStr).format(MONTH_DATE_FORMAT);

export const formatStr2Month = dateStr =>
	dayjs()
		.month(parseInt(dateStr, 10) - 1)
		.format(MONTH_FORMAT);

export const formatDateStr2IntTimestamp = dateStr => {
	const timestamp = dayjs(dateStr).format('x');
	return timestamp === 'Invalid date' ? 0 : parseInt(timestamp, 10);
};

export const checkDateIsIsSameOrAfter = (currentDate, startDate, dateFormat = DATE_FORMAT) =>
	dayjs(formatMoment2Str(currentDate, dateFormat)).isSameOrAfter(startDate);

export const formatDateStrToLocale = dateStr => {
	if (dateStr) {
		const date = formatStr2Moment(dateStr);
		return date.isValid() ? date.format('ll') : dateStr;
	}
	return '';
};

export const formatDateToDisplay = value => dayjs(value).format(DATE_TO_DISPLAY_FORMAT);

export const formatPercentageWithDecimal = (percentage, decimal = 0) => {
	if (isNumber(percentage)) {
		return decimal
			? formatFloatToLocaleWithDecimal(_.multiply(percentage, 100), decimal)
			: _.round(_.multiply(percentage, 100));
	}
	return null;
};

export const formatDecimal2Percentage = percentage =>
	isNumber(percentage) ? _.round(_.multiply(percentage, 100), 2) : null;

export const formatPercentageToDisplay = percentage =>
	isNumber(percentage) ? `${_.round(percentage, 2)}%` : EMPTY_PLACEHOLDER;

export const formatProbabilityToDisplay = probability =>
	isNumber(probability) ? `${_.round(parseFloat(probability) * 100)}%` : EMPTY_PLACEHOLDER;

export const isNotEmptyArray = v => Array.isArray(v) && v.length && v[0];

export const parseStrToInt = v => (isNumber(v) ? parseInt(v, 10) : 0);

export const formatStrToLocale = value => (isNumber(value) ? value.toLocaleString() : value || '-');

export const parseStrToFloatWithDecimal = (value, decimal = 2) => (isNumber(value) ? _.round(value, decimal) : 0);
