import React from 'react';
import { Col, Row } from 'reactstrap';
import { CurrencyUSD, parseValuesToLocale } from '../../../utils/utils';

const Stats = ({ stats }) => {
  const statsData = [
    {
      label: '1 Day',
      value: `${parseValuesToLocale(stats.priceChange24h, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats.priceChangePercentage24h)}%`,
    },
    {
      label: '1 Month',
      value: `${parseValuesToLocale(stats.priceChange30d, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats.priceChangePercentage30d)}%`,
    },
    {
      label: '2 Months',
      value: `${parseValuesToLocale(stats.priceChange60d, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats.priceChangePercentage60d)}%`,
    },
    {
      label: '1 Year',
      value: `${parseValuesToLocale(stats.priceChange1y, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats.priceChangePercentage1y)}%`,
    },
  ];

  const additionalInfo = [
    {
      label: 'Market Cap',
      value: `${parseValuesToLocale(stats.marketCap, CurrencyUSD)} B`,
    },
    {
      label: 'Circulating Supply',
      value: `${parseValuesToLocale(stats.circulatingSupply, CurrencyUSD)} B`,
    },
    {
      label: 'Total Supply',
      value: `${parseValuesToLocale(stats.totalSupply, CurrencyUSD)} B`,
    },
  ];

  return (
    <div className="border-top mb-3 border-bottom pb-4">
      <div className="my-3">
        <h3>Stats</h3>
      </div>
      <Row className="w-100 mt-2 col-12">
        {statsData.map((stat, index) => {
          const hasAdditionalInfo = stat.additionalInfo;
          return (
            <Col key={index} xs="12" md="3" className="p-2 ps-3">
              <div className="text-start">
                <h5 className="fw-semibold">{stat.label}</h5>
                <div className="d-flex align-items-center">
                  <h6
                    className={`mb-0 me-2 text-${stat.value.includes('-') ? 'danger' : 'success'} d-block`}
                  >
                    {stat.value}
                  </h6>
                  ({stat.percentage})
                </div>
              </div>
            </Col>
          );
        })}

        {additionalInfo.map((stat, index) => {
          return (
            <Col key={index} xs="12" md="3" className="p-2 ps-3">
              <div className="text-start">
                <h5 className="fw-semibold">{stat.label}</h5>
                <h6 className="mb-0">{stat.value}</h6>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Stats;
