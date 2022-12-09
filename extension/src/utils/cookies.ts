import { getBaseURL } from './urls';

async function getCookie(): Promise<chrome.cookies.Cookie | null> {
  const cookies = await chrome.cookies.getAll({ name: 'fabricAuth' });
  if (cookies.length) {
    return cookies[0];
  }
  return null;
}

async function cookieExists(): Promise<boolean> {
  const cookies = await chrome.cookies.getAll({ name: 'fabricAuth' });
  if (cookies.length) {
    return true;
  }
  return false;
}

async function deleteCookie(): Promise<string> {
  const deleted = await chrome.cookies.remove({ name: 'fabricAuth', url: getBaseURL() });
  if (!deleted) {
    return chrome.runtime.lastError?.message as string;
  }
  return '';
}

const cookies = {
  getCookie,
  cookieExists,
  deleteCookie,
};

export default cookies;
