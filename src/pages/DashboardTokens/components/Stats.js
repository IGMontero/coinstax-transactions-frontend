import React from 'react';
import { Col, Row } from 'reactstrap';
import {
  CurrencyUSD,
  formatNumberWithBillionOrMillion,
  parseValuesToLocale,
} from '../../../utils/utils';

const Stats = ({ stats }) => {
  const statsData = [
    {
      label: '1 Day',
      value: `${parseValuesToLocale(stats?.priceChange24h, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats?.priceChangePercentage24h)}%`,
    },
    {
      label: '1 Month',
      value: `${parseValuesToLocale(stats?.priceChange30d, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats?.priceChangePercentage30d)}%`,
    },
    {
      label: '2 Months',
      value: `${parseValuesToLocale(stats?.priceChange60d, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats?.priceChangePercentage60d)}%`,
    },
    {
      label: '1 Year',
      value: `${parseValuesToLocale(stats?.priceChange1y, CurrencyUSD)}`,
      percentage: `${parseValuesToLocale(stats?.priceChangePercentage1y)}%`,
    },
  ];

  const additionalInfo = [
    {
      label: 'Market Cap',
      value: `${formatNumberWithBillionOrMillion(stats?.marketCap)} `,
    },
    {
      label: 'Circulating Supply',
      value: `${formatNumberWithBillionOrMillion(stats?.circulatingSupply)}`,
    },
    {
      label: 'Total Supply',
      value: `${formatNumberWithBillionOrMillion(stats?.totalSupply)} `,
    },
  ];

  return (
    <div className="border-top mb-3 border-bottom pb-4">
      <div className="my-3">
        <h3>Stats</h3>
      </div>
      <Row className="w-100 mt-2 col-12">
        {statsData &&
          statsData?.map((stat, index) => {
            return (
              <Col key={index} xs="12" md="3" className="p-2 ps-3">
                <div className="text-start">
                  <h5 className="fw-semibold">{stat.label}</h5>

                  <h6
                    style={{ fontWeight: 100 }}
                    className={`mb-0 me-2 text-${stat.value.includes('-') ? 'danger' : 'success'} d-block`}
                  >
                    {stat.value} ({stat.percentage})
                  </h6>
                </div>
              </Col>
            );
          })}

        {additionalInfo &&
          additionalInfo?.map((stat, index) => {
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
