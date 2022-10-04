import React from 'react';
import { Form, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function Authentication() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Log In</h1>
      <Form>
        <label htmlFor="username">
          Username:
          <input id="username" name="username" />
        </label>
        <label htmlFor="privkey">
          Private Key:
          <input id="privkey" name="privkey" />
        </label>
        <Button fullWidth>Log In</Button>
      </Form>
      <Button fullWidth onClick={() => navigate('/navigation')}>Skip</Button>
    </>
  );
}

export default Authentication;
