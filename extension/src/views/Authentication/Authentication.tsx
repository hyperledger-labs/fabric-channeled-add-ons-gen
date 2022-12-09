import React from 'react';
import {
  ActionFunction, Form, useActionData, useNavigate,
} from 'react-router-dom';
import Button from '../../components/Button/Button';
import APIResponse from '../../models/APIResponse.model';
import authService from '../../services/AuthService';
import { setBaseUrl } from '../../utils/urls';

export const action: ActionFunction = async ({ request }): Promise<APIResponse> => {
  const formData = await request.formData();
  const name = formData.get('username') as string;
  const privkey = formData.get('privkey') as string;
  const serverAddress = formData.get('server-address') as string;
  const err = setBaseUrl(serverAddress);
  if (err !== '') {
    return { success: false, message: err };
  }

  const res = await authService.login(name, privkey);
  if (res.status === 200) {
    return { success: true };
  }

  const json = await res.json();
  return { success: false, message: json.message };
};

export function Authentication() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const data = useActionData() as APIResponse;

  React.useEffect(() => {
    if (data) {
      if (data.success) {
        navigate('/navigation');
      } else {
        setError(data.message!);
      }
    }
  }, [data]);

  return (
    <>
      <h1>Log In</h1>
      <Form method="post">
        <label htmlFor="username">
          Username:
          <input type="text" id="username" name="username" required />
        </label>
        <label htmlFor="privkey">
          Private Key:
          <textarea id="privkey" name="privkey" required />
        </label>
        <label htmlFor="server-name">
          Server address:
          <input type="text" name="server-address" id="server-address" required />
        </label>
        <Button fullWidth>Log In</Button>
      </Form>
      {error !== ''
      && <p>{`Error: ${error}`}</p>}
    </>
  );
}
