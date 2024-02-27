import { saveAs } from 'file-saver';
import _ from "lodash";

import callApi from '../lib/api';
import { showErrorToastr, showSuccessToastr } from './toastr';

export const downloadFile = async (url, name, fromS3 = false) => {
  try {
    const options = {
      method: 'GET',
      responseType: 'blob',
      fromS3,
    };
    showSuccessToastr('label.toastr.downloading_file');
    const response = await callApi(url, options);
    saveAs(response, name);
  } catch (error) {
    showErrorToastr('label.toastr.downloading_failure');
  }
};

const getFileTypeByName = filename => _.toLower(filename.substring(filename.lastIndexOf('.') + 1));

export const formatFileToFormData = (file, fields) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileType', getFileTypeByName(file.name));
  _.forEach(fields, (value, key) => {
    formData.append(key, value);
  });
  return formData;
};

export const formatFilesToFormData = (files, fields) => {
  const formData = new FormData();
  _.forEach(files, file => {
    formData.append('files', file);
  });
  _.forEach(fields, (value, key) => {
    formData.append(key, value);
  });
  return formData;
};
