import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import cookies from '../../utils/cookies';

function Navigation() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const onLogOutClick = async () => {
    const deleted = await cookies.deleteCookie();
    if (deleted !== '') {
      setError(deleted);
      return;
    }
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome</h2>
      <Button fullWidth onClick={() => navigate('/transfer')}>Transfer Asset</Button>
      <Button fullWidth onClick={() => navigate('/all-assets')}>Get All Assets</Button>
      <Button fullWidth onClick={() => navigate('/create-asset')}>Create Asset</Button>
      { /* <Button fullWidth onClick={() => navigate('/get-asset')}>Get Asset</Button> */ }
      <Button fullWidth onClick={onLogOutClick}>Logout</Button>
      { error ? <p>{error}</p> : null}
    </div>
  );
}

export default Navigation;
