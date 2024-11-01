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
  console.log('dark:', isDarkMode);

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
        <Col className="col-12 col-sm-4">
          <Button
            color="white"
            onClick={handleGoogleLogin}
            className="w-100  mb-lg-0 mb-1 border border-dark btn-hover-light btn-icon d-flex align-items-center "
          >
            <img
              src={googleLogo}
              alt="Sign in with Google"
              className="me-2 "
              style={{ height: '18px' }}
            />
            <span className="text-dark">Sign in with Google</span>
          </Button>
        </Col>
        <Col className="col-12 col-sm-4">
          <Button
            color="white"
            onClick={handleAppleLogin}
            className="w-100
            mb-lg-0 mb-1
            border border-dark btn-hover-light btn-icon d-flex align-items-center"
          >
            <i className="ri-apple-fill text-dark fs-16 me-2"></i>
            <span className="text-dark">Sign in with Apple</span>
          </Button>
        </Col>
        <Col className="col-12 col-sm-4">
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
            <span className="text-dark">Coinbase</span>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default SocialAuth;
