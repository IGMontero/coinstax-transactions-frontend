import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Spinner } from 'reactstrap';
import coinbaseLogo from '../../assets/images/wallets/coinbase.png';

const SocialAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL_BASE}/auth/google`;
  };

  const handleCoinbaseLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL_BASE}/auth/coinbase`;
  }

  const handleAppleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL_BASE}/auth/apple`;
  }

  return (
    <Row className="d-flex align-items-center">
      <Col className="col-4">
        <Button
          onClick={handleGoogleLogin}
          color="danger"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <i className="ri-google-fill fs-16 me-2"></i> Google
        </Button>
      </Col>
      <Col className="col-4">
        <Button
          onClick={handleCoinbaseLogin}
          color="primary"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <img
            src={coinbaseLogo}
            alt="Coinbase"
            className="me-2"
            style={{ height: '20px' }}
          />
          Coinbase
        </Button>
      </Col>
      {/* <Col className="col-2 ">or</Col> */}
      <Col className="col-4">
        <Button
          onClick={handleAppleLogin}
          color="dark"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <i className="ri-apple-fill fs-16 me-2"></i>
          Apple
        </Button>
      </Col>
    </Row>
  );
};

export default SocialAuth;
