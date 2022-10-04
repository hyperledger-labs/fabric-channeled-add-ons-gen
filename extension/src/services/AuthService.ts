import { loginURL } from '../utils/constants';

function login(name: string, privkey: string) {
  return fetch(loginURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name,
      privkey,
    }),
  });
}

const authService = {
  login,
};

export default authService;
