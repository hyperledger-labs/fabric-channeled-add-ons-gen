async function cookieExists() {
  const cookies = await chrome.cookies.getAll({ name: 'fabricAuth' });
  if (cookies.length) {
    return true;
  }
  return false;
}

const cookies = {
  cookieExists,
};

export default cookies;
