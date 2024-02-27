import _ from "lodash";

import { XLS, XLSM, XLSX, DOC, DOCX, PPT, PPTX, PDF, TXT, SUPPORT_TYPE } from '../constants';

const POSITIVE_VALUE_REGEX = /^\d+(\.\d{1,3})?$/;
const POSITIVE_ZERO_VALUE_REGEX = /^0+(\.0*)?$/;
export const isPositiveNumber = value => {
  try {
    if (POSITIVE_ZERO_VALUE_REGEX.test(value)) return true;
    return POSITIVE_VALUE_REGEX.test(value);
  } catch (e) {
    return false;
  }
};

const VALUE_REGEX = /^(-)?\d+((\.\d{1,3})|(\.))?$/;
const ZERO_VALUE_REGEX = /^(-|-0|0)?(\.0{1,3})?$/;

export const isValidNumber = value => ZERO_VALUE_REGEX.test(value) || VALUE_REGEX.test(value);
export const isPositiveInt = value => /^\d*[1-9]+\d*$/.test(value);

export const isValidConstraint = (pairLimitItem, varName, value) => {
  if (!(varName && isPositiveNumber(value))) {
    return false;
  }
  if (pairLimitItem && isPositiveNumber(pairLimitItem.value)) {
    return varName.endsWith('low') ? value <= pairLimitItem.value : value >= pairLimitItem.value;
  }
  return true;
};

export const isNullOrTrimEmptyString = str => !str || !str.trim();

const isValidDecimal = value => {
  const digitals = _.split(value, '.');
  return digitals.length === 1 || digitals[1].length <= 3;
};

export const getFileSuffixByName = file => _.toLower(file.name.substring(file.name.lastIndexOf('.')));

export const isValidPositiveDecimal = value => !Number.isNaN(value) && _.toNumber(value) >= 0 && isValidDecimal(value);

export const isNonNullValidPositiveDecimal = value => value != null && !(value === '') && isValidPositiveDecimal(value);

export const positiveValuehasAlphaOrInvalidDecimal = value => !(_.toNumber(value) >= 0 && isValidDecimal(value));

export const isValidModelFileType = type => [XLSX, XLSM].includes(type);

export const isValidRecipeFileType = type => [XLSX, XLS, XLSM].includes(type);

export const isValidSupportFileType = type =>
  [XLS, XLSM, XLSX, DOC, DOCX, PPT, PPTX, DOC, DOCX, PDF, TXT].includes(type);

export const isValidKnowledgeFileType = type => [XLS, XLSX].includes(type);

export const checkFileTypeValid = (supportedType, file) => {
  const fileSuffix = getFileSuffixByName(file);
  switch (supportedType) {
    case SUPPORT_TYPE.MODEL:
      return isValidModelFileType(fileSuffix);
    case SUPPORT_TYPE.SUPPORT:
      return isValidSupportFileType(fileSuffix);
    case SUPPORT_TYPE.RECIPE:
    case SUPPORT_TYPE.PREDICTION:
      return isValidRecipeFileType(fileSuffix);
    case SUPPORT_TYPE.KNOWLEDGE_DAILY_DATA:
      return isValidKnowledgeFileType(fileSuffix);
    case SUPPORT_TYPE.KNOWLEDGE_DOMAIN_DATA:
      return fileSuffix === '.json';
    default:
      return false;
  }
};
