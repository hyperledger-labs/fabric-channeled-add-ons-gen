import { getLoginURL } from '../utils/urls';

function login(name: string, mnemonic: string) {
  return fetch(getLoginURL(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name,
      mnemonic,
    }),
  });
}

const authService = {
  login,
};

export default authService;
