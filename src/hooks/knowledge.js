import callApi from '../lib/api';

import { isNotEmptyArray } from '../utils/formatter';
import { showErrorToastr } from '../utils/toastr';
import { formatFilesToFormData } from '../utils/file';
import {stringifySearchToQuery} from "../utils/query";

export const onGetKnowledgeItems = async (type) => {
  try {
    const res = await callApi(`/all-knowledge${stringifySearchToQuery({type})}`);
    return isNotEmptyArray(res) ? res : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const onUploadKnowledgeFile = async (files, params = null) => {
  try {
    return await callApi(`/knowledge`, {
      method: 'POST',
      data: formatFilesToFormData(files, params),
    });
  } catch (e) {
    showErrorToastr('label.file.upload_failed');
    return null;
  }
};

export const onDeleteKnowledgeItem = async id => {
  try {
    await callApi(`/knowledge/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

export const onGetKnowledgeFileUrl = async id => {
  try {
    return await callApi(`/knowledge/${id}/file-url`);
  } catch (error) {
    return null;
  }
};

export const onGetKnowledgeBatchData = async (answerId, model, isEnglish) => {
  try {
    const res = await callApi(
      `/knowledge/batch-data/${answerId}${stringifySearchToQuery({ model, is_english: isEnglish })}`,
    );
    return isNotEmptyArray(res) ? res : [];
  } catch (error) {
    return [];
  }
};
