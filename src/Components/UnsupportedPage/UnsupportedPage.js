import React from 'react';
import { Col, Row } from 'reactstrap';

const UnsupportedPage = () => {
  return (
    <Row className="d-flex justify-content-center jusitfy-content-between align-items-center border-2">
      <Col
        xxl={9}
        lg={9}
        md={9}
        sm={9}
        xs={9}
        className="d-flex flex-column"
        order="1"
      >
        <div className="d-flex flex-row mt-3">
          <div className="mt-5  ">
            <h1 className="fw-semibold text-danger">Unsupported Address</h1>
            <h5 className="text-primary">Contact our support team </h5>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UnsupportedPage;
