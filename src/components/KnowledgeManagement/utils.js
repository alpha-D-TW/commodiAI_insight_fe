import _ from "lodash";

import { MAX_MB, PDF, XLS, XLSX } from '../../constants';
import { getFileSuffixByName } from '../../utils/validator';
import {isNotEmptyArray} from "../../utils/formatter";

export const FILE_TYPE = {
  PDF: 'PDF',
  EXCEL: 'Excel',
};

export const checkFileValid = (file, fileType = FILE_TYPE.EXCEL) => {
  if (file && file.size < MAX_MB) {
    const fileSuffix = getFileSuffixByName(file);
    return fileType === FILE_TYPE.EXCEL ? [XLS, XLSX].includes(fileSuffix) : fileSuffix === PDF;
  }
  return false;
};

export const checkUploadResult = res => {
  const result = _.flatten(_.map(res, item => (item.status === 'fulfilled' ? item.value : null)));
  return isNotEmptyArray(result) && _.every(result, item => item && item.id);
};
