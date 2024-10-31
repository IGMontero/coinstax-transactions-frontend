import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import coinbaseLogo from '../../assets/images/wallets/coinbase.png';
import googleLogo from '../../assets/images/brands/google.png';
import config from '../../config';

const SocialAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/google`;
  };

  const handleCoinbaseLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/coinbase`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${config.api.API_URL}/auth/apple`;
  };

  return (
    <>
      <Row className="d-flex align-items-center">
        <Col className="col-12 col-sm-4">
          <Button
            color="white"
            onClick={handleGoogleLogin}
            className="w-100 border border-dark btn-hover-light btn-icon d-flex align-items-center "
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
        <Col className="col-12 col-sm-4">
          <Button
            color="white"
            onClick={handleAppleLogin}
            className="w-100 border border-dark btn-hover-light btn-icon d-flex align-items-center"
          >
            <i className="ri-apple-fill fs-16 me-2"></i>
            Sign in with Apple
          </Button>
        </Col>
        <Col className="col-12 col-sm-4">
          <Button
            color="white"
            onClick={handleCoinbaseLogin}
            className="w-100 border border-dark btn-hover-light btn-icon d-flex align-items-center "
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
