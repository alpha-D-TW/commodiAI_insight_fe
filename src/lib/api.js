import i18n from 'i18next';
import _ from "lodash";

import { showErrorToastr } from '../utils/toastr';
import {
  DEFAULT_ERROR_MSG,
  getStatusFromRes,
  isForbiddenError,
  isNetworkError,
  isNotFoundError,
  isUncheckedError,
} from '../utils/responseCode';

const API_SERVER = process.env.REACT_APP_API_SERVER || "http://localhost:8000"

class CustomError extends Error {
  constructor(message, status, body) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = 'CustomError';
    this.message = message;
    this.response = { status };
    this.body = body;
  }
}

const buildRequestOption = options => {
  const method = options && options.method ? options.method : 'GET';
  const data = options && options.data ? options.data : null;
  const basicOptions = {
    ..._.omit(options, ['fromS3', 'ignoreErrorToastr']),
    method,
  };
  if (options && options.fromS3) {
    return basicOptions;
  }

  const basicHeaders = {
    'Accept-Language': i18n.language,
  };
  if (data && data instanceof FormData) {
    return {
      ...basicOptions,
      body: data,
      headers: basicHeaders,
    };
  }
  const requestOptions = {
    ...basicOptions,
    headers: {
      ...basicHeaders,
      'Content-Type': 'application/json',
    },
  };
  return data ? { ...requestOptions, body: JSON.stringify(data) } : requestOptions;
};

const parseResponse = (response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const contentType = response.headers.get('content-type') || response.headers.get('Content-Type');
  if (contentType && contentType.indexOf('application/json') > -1) {
    return response.json();
  }

  return response.text();
};

const checkStatus = async (response, ignoreErrorToastr = false) => {
  if (response && response.status >= 200 && response.status < 300) {
    return response;
  }

  const status = getStatusFromRes(response);

  if (isForbiddenError(status)) {
    showErrorToastr('label.toastr.no_permission_error');
  } else if (!ignoreErrorToastr) {
    if (isNotFoundError(status)) {
      showErrorToastr('label.toastr.not_found_error');
    } else if (isNetworkError(status)) {
      showErrorToastr('label.toastr.network_error');
    } else if (!isUncheckedError(status)) {
      showErrorToastr('label.toastr.server_error');
    }
  }

  let errorBody;
  try {
    errorBody = await response.json();
  } catch (e) {}
  throw new CustomError(DEFAULT_ERROR_MSG, status, errorBody || null);
};

const callApi = async (endpoint, options) => {
  const url = options && options.fromS3 ? endpoint : `${API_SERVER}${endpoint}`;

  const ignoreErrorToastr = options && options.ignoreErrorToastr;

  return fetch(url, buildRequestOption(options))
    .then(res => checkStatus(res, ignoreErrorToastr))
    .then(res => parseResponse(res))
    .catch(e => {
      const errMsg = e && e.message ? e.message : DEFAULT_ERROR_MSG;
      const errorBody = e && e.body ? e.body : null;
      if (errorBody) {
        console.error(errorBody);
      }
      throw new CustomError(errMsg, _.get(e, 'response.status') || 502, errorBody);
    });
};

export default callApi;
