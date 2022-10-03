import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';

import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to the Hyperledger Fabric wallet!</h1>
      <div className="center-image">
        <img id="landing-image" src={`${process.env.PUBLIC_URL}/icons/fabric-logo.png`} alt="Hyperledger  Logo" />
        <Button fullWidth onClick={() => navigate('/navigation')}>Go</Button>
      </div>
    </div>
  );
}

export default Landing;
