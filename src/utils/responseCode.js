import _ from "lodash";
import { parseStrToInt } from './formatter';

export const getStatusFromRes = res => {
  const { status, response } = res || {};
  if (status) {
    return parseStrToInt(status);
  }
  if (response?.status) {
    return parseStrToInt(response.status);
  }
  return 0;
};

export const isNetworkError = status => !status || status === 408 || status === 504 || status === 502;

export const isForbiddenError = status => status === 403;

export const isNotFoundError = status => status === 404;

export const isConflictError = status => status === 409;

const isResourceGoneError = status => status === 410;

export const isUncheckedError = status => isConflictError(status) || isResourceGoneError(status) || status === 422;

export const isConflictRes = res => getStatusFromRes(res) === 409;

export const isResourceGoneRes = res => getStatusFromRes(res) === 410;

export const getErrorMsgFromResponse = res => {
  const errStatus = _.get(res, 'response.status') || 500;
  return isNetworkError(errStatus) ? 'label.toastr.network_error' : 'label.toastr.server_error';
};

export const DEFAULT_ERROR_MSG = 'error.common';
