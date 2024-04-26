import React from 'react';
import { Col, Row } from 'reactstrap';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';

const Stats = () => {
  const statsData = [
    {
      label: '1 Day',
      value: '-0.61%',
      additionalInfo: {
        label: 'Market Cap',
        value: '385',
      },
    },
    {
      label: '1 Month',
      value: '-9.4%',
      additionalInfo: {
        label: 'Circulating Supply',
        value: '18.8 ',
      },
    },
    {
      label: '3 Months',
      value: '+38.5%',
    },
    {
      label: '1 Year',
      value: '+63.9%',
    },
  ];

  return (
    <div className="border-top mb-3 border-bottom pb-5">
      <div className="my-5">
        <h3>Stats</h3>
      </div>
      <Row className="w-100 mt-5">
        {statsData.map((stat, index) => {
          const hasAdditionalInfo = stat.additionalInfo;
          return (
            <Col key={index} xs="12" md="3" className="p-2">
              <div className="text-center">
                <h5 className="fw-semibold">{stat.label}</h5>
                <h6
                  className={` text-${stat.value.includes('-') ? 'success' : 'danger'} d-block`}
                >
                  {stat.value}
                </h6>
              </div>
              {hasAdditionalInfo && (
                <div className="text-center mt-5">
                  <h5 className="fw-semibold">{stat.additionalInfo.label}</h5>
                  <h6 className="text-center d-block">
                    {parseValuesToLocale(
                      stat.additionalInfo.value,
                      CurrencyUSD,
                    )}{' '}
                    B
                  </h6>
                </div>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stats;
