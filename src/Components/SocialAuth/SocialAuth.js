import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Spinner } from 'reactstrap';

const SocialAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL_BASE}/auth/google`;
  };

  return (
    <Row className="d-flex align-items-center justify-content-center">
      <Col className="col-5">
        <Button
          onClick={handleGoogleLogin}
          color="danger"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <i className="ri-google-fill fs-16 me-2"></i> Google
        </Button>
      </Col>
      {/* <Col className="col-2 ">or</Col>
      <Col className="col-5">
        <Button
          color="dark"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <i className="ri-apple-fill fs-16 me-2"></i>
          Apple
        </Button>
      </Col> */}
    </Row>
  );
};

export default SocialAuth;
