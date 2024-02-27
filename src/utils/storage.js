export const SKIP_BASELINE_PREVIEW_KEY = 'skip-baseline-preview';
export const SKIP_RECIPE_PREVIEW_KEY = 'skip-recipe-preview';

export const CHAT_SESSION_ID = 'chatSessionId';

export const setLocalStorage = (key, value) => {
  if (window.localStorage) {
    window.localStorage[key] = value;
  }
};

export const getLocalStorage = key => {
  const value = window.localStorage ? window.localStorage[key] : '';
  if (typeof value === 'string' && (value === 'false' || value === 'true')) {
    return JSON.parse(value);
  }
  return value || '';
};

export const setSessionStorage = (key, value) => {
  if (window.sessionStorage) {
    window.sessionStorage.setItem(key, value);
  }
};

export const getSessionStorage = key => {
  const value = window.sessionStorage ? window.sessionStorage.getItem(key) : '';
  if (typeof value === 'string' && (value === 'false' || value === 'true')) {
    return JSON.parse(value);
  }
  return value || '';
};

export const clearSessionStorage = key => {
  if (window.sessionStorage) {
    window.sessionStorage.removeItem(key);
  }
};
