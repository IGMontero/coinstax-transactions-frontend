import React from 'react';
import { Button, Col, Row } from 'reactstrap';

const SocialAuth = () => {
  return (
    <Row className="d-flex align-items-center">
      <Col className="col-5">
        <Button
          color="danger"
          className="w-100 btn-icon d-flex align-items-center "
        >
          <i className="ri-google-fill fs-16 me-2"></i> Google
        </Button>{' '}
      </Col>
      <Col className="col-2 ">or</Col>
      <Col className="col-5">
        <Button
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
