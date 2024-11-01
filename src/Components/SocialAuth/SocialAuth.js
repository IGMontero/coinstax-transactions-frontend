import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { layoutModeTypes } from '../../Components/constants/layout';
import coinbaseLogo from '../../assets/images/wallets/coinbase.png';
import googleLogo from '../../assets/images/brands/google.png';
import config from '../../config';

const SocialAuth = () => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const handleGoogleLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/google`;
  };

  const handleCoinbaseLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/coinbase`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/apple`;
  };

  var btnclasses = 'w-100 border btn-icon d-flex align-items-center btn-hover-light';
  btnclasses += isDarkMode ? ' border-white text-white' : ' border-dark text-dark';

  return (
    <>
      <Row className="d-flex align-items-center">
        <Col className="col-4">
          <Button
            color="white"
            onClick={handleGoogleLogin}
            className={btnclasses}
          >
            <img
              src={googleLogo}
              alt="Sign in with Google"
              className="me-2"
              style={{ height: '18px' }}
            />
            Sign in with Google
          </Button>
        </Col>
        <Col className="col-4">
          <Button
            color="white"
            onClick={handleAppleLogin}
            className={btnclasses}
          >
            <i className="ri-apple-fill fs-16 me-2"></i>
            Sign in with Apple
          </Button>
        </Col>
        <Col className="col-4">
          <Button
            color="white"
            onClick={handleCoinbaseLogin}
            className={btnclasses}
          >
            <img
              src={coinbaseLogo}
              alt="Sign in with Coinbase"
              className="me-2"
              style={{ height: '18px' }}
            />
            Coinbase
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SocialAuth;
