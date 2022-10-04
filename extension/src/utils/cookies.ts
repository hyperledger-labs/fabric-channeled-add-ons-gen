async function cookieExists() {
  const cookies = await chrome.cookies.getAll({ name: 'fabricAuth' });
  if (cookies.length) {
    console.log(cookies);
    return true;
  }
  return false;
}

const cookies = {
  cookieExists,
};

export default cookies;
