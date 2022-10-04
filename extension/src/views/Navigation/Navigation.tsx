import React from 'react';
import { useNavigate } from 'react-router-dom';

// import cookies from '../../utils/cookies';
import Button from '../../components/Button/Button';

function Navigation() {
  const navigate = useNavigate();
  const showBackButton = true;
  // const [showBackButton, setShowBackButton] = React.useState(true);
  /*
   * If the cookie exists and is not expired,
   * we hide the first view to save unnecessary clicks.
   * TODO: Enable this when we have a way for users to logout.
   */

  // React.useEffect(() => {
  //   cookies.cookieExists()
  //     .then((result) => {
  //       if (result) {
  //         setShowBackButton(false);
  //       }
  //     });
  // }, []);

  return (
    <div>
      <h2>Welcome</h2>
      <Button fullWidth onClick={() => navigate('/create-asset')}>Create Asset</Button>
      <Button fullWidth onClick={() => navigate('/all-assets')}>Get all Assets</Button>
      <Button fullWidth onClick={() => navigate('/get-asset')}>Get Asset</Button>
      <Button fullWidth onClick={() => navigate('/transfer')}>Transfer Asset</Button>
      {showBackButton
          && <Button fullWidth onClick={() => navigate('/')}>Back</Button>}
    </div>
  );
}

export default Navigation;
