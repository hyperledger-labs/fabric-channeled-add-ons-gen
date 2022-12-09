import { getLoginURL } from '../utils/urls';

function login(name: string, privkey: string) {
  return fetch(getLoginURL(), {
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
