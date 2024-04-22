import React, { useState } from 'react';
import ChartTokens from './components/ChartTokens';
import { Col } from 'reactstrap';

const DashboardTokens = () => {
  const [tokenName, setTokenName] = useState('Ethereum');

  return (
    <React.Fragment>
      <div className="page-content ">
        <div className="mt-5 mb-4">
          <h1>{tokenName}</h1>
        </div>
        <Col className="my-5 col-12">
          <ChartTokens />
        </Col>
      </div>
    </React.Fragment>
  );
};

export default DashboardTokens;
