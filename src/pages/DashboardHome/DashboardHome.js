import React from 'react';
import { Container } from 'reactstrap';

const DashboardHome = () => {
  return (
    <React.Fragment>
      <Container fluid className="page-content" style={{ height: '100vh' }}>
        <div className="d-flex justify-content-center align-items-start">
          <h1>Search for your wallet address to get started</h1>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default DashboardHome;
