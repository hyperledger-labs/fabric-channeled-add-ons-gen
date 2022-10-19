import React from 'react';
import { useNavigate } from 'react-router-dom';

import cookies from '../../utils/cookies';
import Button from '../../components/Button/Button';

import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  /*
   * If the cookie exists and is not expired,
   * we can directly go to the navigation page
   * and skip the login process. We load the landing
   * page after we get the result, so we avoid flickering.
   */
  React.useLayoutEffect(() => {
    cookies.cookieExists()
      .then((result) => {
        if (result) {
          navigate('/navigation');
        }
        setLoading(false);
      });
  });

  return (
    <div>
      {
      loading
        ? null
        : (
          <>
            <h1>Welcome to the Hyperledger Fabric wallet!</h1>
            <div className="center-image">
              <img
                id="landing-image"
                src={`${process.env.PUBLIC_URL}/icons/fabric-logo.png`}
                alt="Hyperledger Logo"
              />
              <Button fullWidth onClick={() => navigate('/auth')}>Go</Button>
            </div>
          </>
        )
      }
    </div>
  );
}

export default Landing;
