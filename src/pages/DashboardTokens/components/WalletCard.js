import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Progress,
  ListGroup,
  ListGroupItem,
  Badge,
  Col,
  Row,
} from 'reactstrap';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';

const WalletCard = () => {
  const equity = 89670.78;
  const ethAmount = 28.531;
  const averageCost = 1238.32;
  const paidFees = 114.98;
  const hourReturn = -0.51;
  const loss = 455.37;

  return (
    <div className="mt-5">
      <div className="border rounded p-3">
        <div className="card-title"></div>

        <Row className="col-12 mb-5 align-items-center d-flex">
          <Col className="col-5 d-flex flex-column px-auto justify-content-center">
            <div className="mb-2">
              <h5 className="mb-0">
                Equity
                <Badge
                  color="soft-dark"
                  className="mb-2 ms-2 p-1 fs-7"
                  style={{ fontWeight: 'inherit' }}
                >
                  {' '}
                  <span className="text-dark">84,4%</span>
                </Badge>
              </h5>
              <span className="fs-4 ">
                {parseValuesToLocale(equity, CurrencyUSD)}{' '}
              </span>
            </div>
            <span className="float-right">
              {parseValuesToLocale(ethAmount)} ETH
            </span>
          </Col>
          <Col className="col-5 d-flex flex-column">
            <div className="mb-2">
              <h5 className="mb-0">Profit/Loss </h5>
              <span className="text-muted float-right">
                Available in Premium
              </span>
            </div>
            24-hour Return{' '}
            <span className="float-right">
              {hourReturn}% (${loss.toFixed(2)})
            </span>
          </Col>

          <Col className="col-2 d-flex flex-column">
            <div className="mb-2">
              <h5 className="mb-0">Average Cost </h5>
              <span className="float-right">
                {parseValuesToLocale(averageCost, CurrencyUSD)}
              </span>
            </div>
            Paid Fees{' '}
            <span className="float-right">
              ${parseValuesToLocale(paidFees, CurrencyUSD)}
            </span>
          </Col>
        </Row>
        <hr />
        <Row className="d-flex align-items-center">
          <Col className="col-7 d-flex ">
            <i className="mdi mdi-wallet fs-1 text-dark me-2"></i>
            <div className="d-flex flex-column">
              <span className="mb-0 fs-5">Wallet </span>
              <span className="fs-7">
                {parseValuesToLocale(equity, CurrencyUSD)} (
                {parseValuesToLocale(ethAmount)} ETH)
              </span>{' '}
              <span className="fs-7"></span>
            </div>
          </Col>
          {/* <Col className="col-6 text-start align-items-start "></Col> */}
          <Col className="col-5 ">
            100% <Progress value="100" />
          </Col>
        </Row>
        {/* <div className="card-title mb-0  d-flex align-items-center">
          <i className="mdi mdi-wallet fs-1 text-dark me-2"></i>
        </div>
        <div className="d-flex flex-column ms-4">
          <h5 className="mb-0">Wallet </h5>
          <span> {parseValuesToLocale(equity, CurrencyUSD)}</span>{' '}
          <span>{parseValuesToLocale(ethAmount)} ETH</span>
        </div> */}
        {/* <Progress value="100" /> */}
      </div>
    </div>
  );
};

export default WalletCard;
