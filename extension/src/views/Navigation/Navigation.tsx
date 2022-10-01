import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

function Navigation() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>
        Welcome
        <Button fullWidth onClick={() => navigate('/create-asset')}>Create Asset</Button>
        <Button fullWidth onClick={() => navigate('/all-assets')}>Get all Assets</Button>
        <Button fullWidth onClick={() => navigate('/get-asset')}>Get Asset</Button>
        <Button fullWidth onClick={() => navigate('/transfer')}>Transfer Asset</Button>
        <Button fullWidth onClick={() => navigate('/')}>Back</Button>
      </h2>

    </div>
  );
}

export default Navigation;
