import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, Spinner } from 'reactstrap';
import {
  CurrencyUSD,
  formatDateToLocale,
  parseValuesToLocale,
} from '../../../utils/utils';

const ChartTokens = () => {
  const [data, setData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: '',
        data: [12.55, 19.03, -3.2, 5.98, 2.22, 9.87],
        fill: false,
        borderColor: '#0759BC',
        tension: 0.1,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(
    data.datasets[0].data[data.datasets[0].data.length - 1],
  );
  const [subtitle, setSubtitle] = useState('0');
  const [activeDate, setActiveDate] = useState('');

  const calculatePercentageChange = (currentIndex, data) => {
    if (currentIndex > 0) {
      const currentValue = data[currentIndex];
      const previousValue = data[currentIndex - 1];
      return ((currentValue - previousValue) / previousValue) * 100;
    }
    return 0;
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          //   ticks: {
          //     display: false,
          //   },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      displayColors: false,

      callbacks: {
        title: function (tooltipItems, data) {
          if (tooltipItems.length > 0) {
            const index = tooltipItems[0].index;
            const salesValue = data.datasets[0].data[index];
            const percentageChange = calculatePercentageChange(
              index,
              data.datasets[0].data,
            );
            setTitle(`${salesValue}`);
            setSubtitle(percentageChange.toFixed(2));
            setActiveDate(data.labels[index]);
          }
          return '';
        },
        label: function (tooltipItem) {
          return `${tooltipItem.yLabel}`;
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
      onHover: function (e, activeElements) {
        if (activeElements.length === 0) {
          const lastDataIndex = data.datasets[0].data.length - 1;
          setTitle(data.datasets[0].data[lastDataIndex]);
          setSubtitle(
            calculatePercentageChange(
              lastDataIndex,
              data.datasets[0].data,
            ).toFixed(2),
          );
          setActiveDate(data.labels[lastDataIndex]);
        }
      },
    },
    title: {
      display: false,
      text: title,
      fontSize: 24,
      fontColor: '#000',
    },
    subtitle: {
      display: true,
      text: `${subtitle}%`,
      fontSize: 16,
      fontColor: subtitle > 0 ? '#3ac47d' : '#f1556c',
    },
  };

  const fetchData = (days) => {
    setLoading(true);
    setTimeout(() => {
      const newData = { ...data };
      setData(newData);
      setLoading(false);
    }, 1000);
  };

  const renderFilterButtons = () => {
    return (
      <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-1 p-2">
        {['7D', '1M', '6M', '1Y', 'ALL'].map((period, index) => (
          <button
            key={index}
            onClick={() => fetchData(period)}
            className={` btn btn-soft-primary  rounded-pill  timeline-btn btn-sm ${index < 4 ? 'me-2' : ''}`}
          >
            {period}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-2 rounded p-2" style={{ zIndex: 1 }}>
      <div className="d-flex align-items-end">
        <h1 className="d-flex align-items-center">
          {parseValuesToLocale(title, CurrencyUSD)}
        </h1>
        <h4
          style={{ marginBottom: '.7rem' }}
          className={`ms-2  text-${subtitle >= 0 ? 'success' : 'danger'}`}
        >
          {parseValuesToLocale(subtitle, '')}%
        </h4>
      </div>
      <span className="ms-2 text-muted mb-3">{activeDate}</span>
      {loading ? (
        <Card
          className="mb-0"
          style={{
            height: '250px',
          }}
        >
          <CardBody className="d-flex justify-content-center align-items-center">
            <div className="text-center d-flex justify-content-center">
              <Spinner />
            </div>
          </CardBody>
        </Card>
      ) : (
        <div
          style={{
            height: '250px',
          }}
        >
          <Line height={250} data={data} options={options} />
        </div>
      )}
      <div className="toolbar mb-3">{renderFilterButtons()}</div>
    </div>
  );
};

export default ChartTokens;
