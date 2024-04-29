import React from 'react';
import { Col, Row } from 'reactstrap';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';

const History = () => {
  const dataHistory = [
    {
      action: 'Receive',
      amount: '+0.289 ETH',
      value: '3230.14',
      valueUSD: '1030.14',
      date: 'Mar 28, 2024',
      time: '01:55 PM',
    },
    {
      action: 'Send',
      amount: '-0.2 ETH',
      value: '461.89',
      valueUSD: '1030.14',
      date: 'Feb 2, 2024',
      time: '05:41 AM',
    },
    {
      action: 'Receive',
      amount: '+0.685 ETH',
      value: '871.66',
      date: 'Dec 15, 2022',
      valueUSD: '1030.14',
      time: '03:19 PM',
    },
  ];

  return (
    <div className="mb-3 border-bottom pb-5">
      <div className="my-5">
        <h3>History</h3>
      </div>
      {dataHistory.map((item, index) => (
        <Row key={index} className="mb-3 cursor-pointer">
          <Col className="">
            <div>
              <span className="text-dark">
                {item.action} at {parseValuesToLocale(item.value, CurrencyUSD)}
              </span>
            </div>
            <span className="text-muted">
              {item.date}, {item.time}
            </span>
          </Col>
          <Col className="text-end">
            <div
              className={`${item.action === 'Receive' ? 'text-success' : 'text-danger'}`}
            >
              {item.amount}
            </div>
            <Col className="text-muted">
              {parseValuesToLocale(item.valueUSD, CurrencyUSD)}
            </Col>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default History;
