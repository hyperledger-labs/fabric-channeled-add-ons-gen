import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import RootAPIService from '../../services/RootAPIService';
import cookies from '../../utils/cookies';
import localStorage from '../../utils/localStorage';

function Navigation() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [serverName, setServerName] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    RootAPIService.getName()
      .then((name) => {
        setServerName(name);
        setLoading(false);
      });
  }, []);

  const onLogOutClick = async () => {
    Promise.all([cookies.deleteCookie(), localStorage.deleteLocalStorage('url')])
      .then(([deleted, removed]) => {
        if (deleted !== '') {
          setError(deleted);
          return;
        }
        if (!removed) {
          setError('Local storage error');
          return;
        }
        navigate('/');
      });
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div>
      <h2>
        Welcome at
        {' '}
        {serverName}
      </h2>
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
