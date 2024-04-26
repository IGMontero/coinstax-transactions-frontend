import React, { useState } from 'react';
import ChartTokens from './components/ChartTokens';
import { Col } from 'reactstrap';
import ethIcon from '../../assets/images/svg/crypto-icons/eth.svg';
import Stats from './components/Stats';

const DashboardTokens = () => {
  const [tokenName, setTokenName] = useState('Ethereum');

  return (
    <React.Fragment>
      <div className="page-content ">
        <div className="mt-5 ">
          <div className="d-flex align-items-center">
            <img src={ethIcon} alt="Ethereum" className="icon-lg me-2" />
            <span className="fs-4">ETH</span>
          </div>
          <h1 className="d-flex align-items-center mt-3 mb-4">
            {tokenName}
            <i className="mdi mdi-check-decagram ms-2 fs-2 text-primary"></i>
          </h1>
        </div>
        <Col className="col-12 mb-5">
          <ChartTokens />
        </Col>

        <Col className="col-12 my-5">
          <Stats />
        </Col>
      </div>
    </React.Fragment>
  );
};

export default DashboardTokens;
