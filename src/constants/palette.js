import _ from "lodash";
import { isNumber } from '../utils/formatter';

const STEEL_TYPES = [
  'steel_subtype1',
  'steel_subtype2',
  'steel_subtype3',
  'steel_subtype4',
  'steel_subtype5',
  'steel_subtype6',
  'steel_subtype7',
];

export const DARK_RED = '#d51f31';
export const AREA_CHART_DEFAULT_COLOR = '#99b8ef';
export const LINE_CHART_DEFAULT_COLOR = '#2251ff';
export const LINE_COLORS = [
  '#051c2c',
  '#00a9f4',
  LINE_CHART_DEFAULT_COLOR,
  '#82e1f1',
  '#027ab1',
  '#abc1db',
  '#1677ff',
  '#9ba3fe',
  '#8c5ac8',
];

export const YEAR_LINE_COLORS = ['#051c2c', LINE_CHART_DEFAULT_COLOR, '#00a9f4', '#82e1f1', '#034b6f', '#027ab1'];

export const BAR_SUM_COLOR = {
  chart: '#afc3ffD9',
  text: '#000',
};

export const BULK_BAR_COLOR = '#71d2f1D9';
export const BAR_COLORS = [
  {
    chart: '#051c2cD9',
    text: '#fff',
  },

  {
    chart: '#00a9f4D9',
    text: '#000',
  },
  {
    chart: '#1f40e6D9',
    text: '#fff',
  },
  {
    chart: '#aae6f0D9',
    text: '#000',
  },
  {
    chart: '#3c96b4D9',
    text: '#000',
  },
  {
    chart: '#034b6f',
    text: '#fff',
  },
  {
    chart: '#027ab1',
    text: '#fff',
  },
  {
    chart: '#39bdf3D9',
    text: '#000',
  },
  {
    chart: BULK_BAR_COLOR,
    text: '#000',
  },
  BAR_SUM_COLOR,
];

export const CHART_TEXT_GRAY = '#7f7f7f';
export const CHART_AXIS_TEXT_SIZE = 12;
export const CHART_LABEL_TEXT_SIZE = 10;

export const RECIPE_COMPARISON_COLORS = ['#051c2c', '#00a9f4', '#1f40e6', '#aae6f0', '#3c96b4', '#afc3ff'];

export const getColorByType = type => {
  const typeIndex = _.findIndex(STEEL_TYPES, item => item === type);
  return typeIndex > -1 ? LINE_COLORS[typeIndex % LINE_COLORS.length] : LINE_COLORS[0];
};

export const getColorByIndex = (index, colors = LINE_COLORS) =>
  !index || !isNumber(index) ? colors[0] : colors[index % colors.length];

export const getColorByYear = index =>
  !index || !isNumber(index) ? YEAR_LINE_COLORS[0] : YEAR_LINE_COLORS[index % YEAR_LINE_COLORS.length];

export const getBarColorByIndex = index =>
  !index || !isNumber(index) ? BAR_COLORS[0] : BAR_COLORS[index % BAR_COLORS.length];
