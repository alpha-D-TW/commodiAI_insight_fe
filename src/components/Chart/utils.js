import { DATE_FORMAT, formatStr2Moment } from '../../utils/formatter';

const getBeforeDate = (date, dateFormat, num, unit = 'month') =>
  formatStr2Moment(date, dateFormat).subtract(num, unit).format(DATE_FORMAT);

export const DEFAULT_ALL_OPTION = {
  key: 'all',
};

export const SHORT_SELECT_OPTIONS = [
  DEFAULT_ALL_OPTION,
  {
    key: '1_month',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 1),
  },
  {
    key: '3_months',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 3),
  },
  {
    key: '6_months',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 6),
  },
  {
    key: 'ytd',
    render: (date, dateFormat) => formatStr2Moment(date, dateFormat).set('month', 0).set('date', 1).format(DATE_FORMAT),
  },
  {
    key: '1_year',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 1, 'year'),
  },
];

export const LONG_SELECT_OPTIONS = [
  DEFAULT_ALL_OPTION,
  {
    key: '6_months',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 6),
  },
  {
    key: '1_year',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 1, 'year'),
  },
  {
    key: '3_years',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 3, 'year'),
  },
  {
    key: '5_years',
    render: (date, dateFormat) => getBeforeDate(date, dateFormat, 5, 'year'),
  },
];
