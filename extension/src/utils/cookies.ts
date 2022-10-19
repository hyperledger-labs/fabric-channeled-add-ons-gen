import { baseURL } from './constants';

async function cookieExists(): Promise<boolean> {
  const cookies = await chrome.cookies.getAll({ name: 'fabricAuth' });
  if (cookies.length) {
    return true;
  }
  return false;
}

async function deleteCookie(): Promise<string> {
  const deleted = await chrome.cookies.remove({ name: 'fabricAuth', url: baseURL });
  if (!deleted) {
    return chrome.runtime.lastError?.message as string;
  }
  return '';
}

const cookies = {
  cookieExists,
  deleteCookie,
};

export default cookies;
