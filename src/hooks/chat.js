import dayjs from 'dayjs';
import _ from "lodash";

import callApi from '../lib/api';
import { CHAT_SESSION_ID, clearSessionStorage, setSessionStorage } from '../utils/storage';
import { isNotEmptyArray } from '../utils/formatter';
import { DATE_FORMAT, formatStr2Moment } from '../utils/formatter';
import {stringifySearchToQuery} from "../utils/query";

const EMPTY_RESULT = { id: '', history: [] };

export const onPostChat = async (question, chatSessionId, model, existingQuestionId) => {
  try {
    const res = await callApi(`/chat`, {
      method: 'POST',
      data: {
        chatSessionId,
        question,
        model,
        existingQuestionId,
      },
    });
    setSessionStorage(CHAT_SESSION_ID, res?.id || '');
    return res?.id ? res : EMPTY_RESULT;
  } catch (error) {
    console.error(error);
    return EMPTY_RESULT;
  }
};

export const onGetChatHistoryById = async id => {
  try {
    if (id) {
      const res = await callApi(`/histories/${id}`, {
        method: 'GET',
      });
      return isNotEmptyArray(res) ? res : null;
    }
    return null;
  } catch (error) {
    console.error(error);
    clearSessionStorage(CHAT_SESSION_ID);
    return null;
  }
};

const mapHistoryByDate = res => {
  const today = formatStr2Moment(dayjs().format(DATE_FORMAT));
  return _.map(
    _.filter(res, item => item?.historyId && item?.updated),
    item => {
      const updatedDate = formatStr2Moment(dayjs(item.updated).format(DATE_FORMAT));
      const daysBeforeToday = today.diff(updatedDate, 'days');
      return {
        ...item,
        daysBeforeToday,
      };
    },
  );
};

export const onGetAllHistory = async () => {
  try {
    const res = await callApi(`/histories`, {
      method: 'GET',
    });
    return isNotEmptyArray(res) ? mapHistoryByDate(res) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const onDeleteChat = async id => {
  try {
    await callApi(`/histories/${id}`, {
      method: 'DELETE',
    });
    setSessionStorage(CHAT_SESSION_ID, '');
  } catch (error) {
    console.error(error);
  }
};

export const onGetSampleQuestions = async (isEnglish) => {
  try {
    const res = await callApi(`/sample-questions${stringifySearchToQuery({ is_english: isEnglish })}`);
    return isNotEmptyArray(res) ? res : [];
  } catch (error) {
    console.error(error);
    return null;
  }
};
