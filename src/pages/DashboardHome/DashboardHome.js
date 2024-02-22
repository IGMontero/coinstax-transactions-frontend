import React from 'react';
import { Col, Container } from 'reactstrap';

const DashboardHome = () => {
  return (
    <React.Fragment>
      <Col className="col-12 mt-5" style={{ height: '100vh', width: '100%' }}>
        <div className="d-flex justify-content-center align-items-start">
          <h1>Search for your wallet address to get started</h1>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default DashboardHome;
