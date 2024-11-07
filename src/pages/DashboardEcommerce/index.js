import React from 'react';
import { Container } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';

const DashboardEcommerce = () => {

  return (
    <React.Fragment>
      <Helmet title="Dashboard" />
      <div className="page-content">
        <Container fluid></Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
