import React, { useEffect, useRef, useState } from 'react';
import {
  fetchPerformance,
  fetchPerformanceToken,
} from '../../../slices/transactions/thunk';
import { useDispatch } from 'react-redux';
import { Card, CardBody, Col, Spinner } from 'reactstrap';
import {
  CurrencyUSD,
  getMaxMinValues,
  formatDateToLocale,
  parseValuesToLocale,
  calculatePercentageChange,
} from '../../../utils/utils';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

const PerformanceChart = ({
  address,
  setIsUnsupported,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const { token } = useParams();

  const [activeFilter, setActiveFilter] = useState('one_week');

  const [showMessage, setShowMessage] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Performance',
        data: [],
        fill: true,
        borderColor: '#0759BC',
        tension: 0.1,
        backgroundColor: '#0758bc1b',
      },
    ],
  });

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('0');
  const [activeDate, setActiveDate] = useState('');

  const [chartOptions, setChartOptions] = useState({
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          position: 'right',
          gridLines: { display: false },
          ticks: {
            display: true,
          },
        },
      ],
      xAxes: [
        {
          type: 'time',
          time: {
            parser: 'YYYY-MM-DD',
            tooltipFormat: 'll',
            unit: 'day',
            displayFormats: {
              day: 'MMM DD',
            },
          },
          ticks: {
            source: 'data',
            autoSkip: true,
            beginAtZero: true,
          },
          gridLines: { display: false },
        },
      ],
    },
    legend: { display: false },
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
            setTitle(parseValuesToLocale(salesValue, CurrencyUSD));
            const percentageChange = calculatePercentageChange(
              index,
              data.datasets[0].data,
            );
            setSubtitle(percentageChange.toFixed(2));
            const date = new Date(data.labels[index]);
            setActiveDate(formatDateToLocale(date));
          }
          return '';
        },
        label: function (tooltipItem) {
          return `${parseValuesToLocale(tooltipItem.yLabel, CurrencyUSD)}`;
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    title: {
      display: false,
    },
    subtitle: {
      display: true,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  });

  const fetchAndSetData = (days) => {
    setLoading(true);
    if (address) {
      const params = days ? { address, days } : { address };
      dispatch(fetchPerformance(params))
        .unwrap()
        .then((response) => {
          if (response.unsupported) {
            setIsUnsupported(true);
          } else {
            const newLabels = response.total.map(
              (item) => new Date(item.calendarDate),
            );
            const newData = response.total.map((item) => item.close.quote);
            const { minValue, maxValue } = getMaxMinValues(newData);

            const minTick = minValue - (maxValue - minValue) * 1;
            const maxTick = maxValue + (maxValue - minValue) * 1;

            setChartData({
              labels: newLabels,
              datasets: [{ ...chartData.datasets[0], data: newData }],
            });

            setChartOptions((prevOptions) => ({
              ...prevOptions,
              scales: {
                ...prevOptions.scales,
                yAxes: [
                  {
                    ...prevOptions.scales.yAxes[0],
                    ticks: {
                      ...prevOptions.scales.yAxes[0].ticks,
                      min: minTick,
                      max: maxTick,
                      callback: function (value) {
                        // only show min and max values
                        if (value === minTick || value === maxTick) {
                          return parseValuesToLocale(value, CurrencyUSD);
                        }
                      },
                    },
                  },
                ],
              },
            }));
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching performance data:', error);
          setLoading(false);
        });
    }
  };

  const fetchAndSetDataForToken = (days) => {
    setLoading(true);
    if (address) {
      const params = days ? { address, days } : { address };
      dispatch(fetchPerformanceToken(params))
        .unwrap()
        .then((response) => {
          if (response.unsupported) {
            setIsUnsupported(true);
          } else {
            const uniqueDates = new Set();
            const newLabels = [];
            const newData = [];

            response.prices.forEach((item) => {
              const date = new Date(item[0]);
              const dateString = date.toISOString().split('T')[0];

              // Check if the date string is not already present in the set
              if (!uniqueDates.has(dateString)) {
                uniqueDates.add(dateString);
                newLabels.push(dateString);
                // Add the price value to the data array
                newData.push(item[1]);
              }
            });

            const { minValue, maxValue } = getMaxMinValues(newData);
            const minTick = minValue - (maxValue - minValue) * 1;
            const maxTick = maxValue + (maxValue - minValue) * 1;

            setChartData({
              labels: newLabels,
              datasets: [{ ...chartData.datasets[0], data: newData }],
            });

            setChartOptions((prevOptions) => ({
              ...prevOptions,
              scales: {
                ...prevOptions.scales,
                yAxes: [
                  {
                    ...prevOptions.scales.yAxes[0],
                    ticks: {
                      ...prevOptions.scales.yAxes[0].ticks,
                      min: minTick,
                      max: maxTick,
                      stepSize: (maxTick - minTick) / 10,
                      callback: function (value) {
                        // only show min and max values
                        if (value === minTick || value === maxTick) {
                          return parseValuesToLocale(value, CurrencyUSD);
                        }
                      },
                    },
                  },
                ],
              },
            }));
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching performance data:', error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!token) {
      fetchAndSetData();
    } else {
      fetchAndSetDataForToken(7);
    }
  }, [token, address]);

  useEffect(() => {
    if (chartData.labels.length > 0) {
      const lastValue =
        chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
      setTitle(parseValuesToLocale(lastValue, CurrencyUSD));
      const percentageChange = calculatePercentageChange(
        chartData.datasets[0].data.length - 1,
        chartData.datasets[0].data,
      );
      setSubtitle(percentageChange.toFixed(2));
      const date = new Date(chartData.labels[chartData.labels.length - 1]);
      setActiveDate(formatDateToLocale(date));
    }
  }, [chartData]);

  const handleFilterForDays = (days, filterId) => {
    if (token) {
      fetchAndSetDataForToken(days);
    } else {
      fetchAndSetData(days);
    }
    setActiveFilter(filterId);
  };

  const renderFiltersButtons = () => {
    return (
      <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-1 p-2">
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(7, 'one_week')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
            activeFilter === 'one_week' ? 'active' : ''
          }`}
          id="one_week"
        >
          7D
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(30, 'one_month')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
            activeFilter === 'one_month' ? 'active' : ''
          }`}
          id="one_month"
        >
          1M
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(180, 'six_months')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
            activeFilter === 'six_months' ? 'active' : ''
          }`}
          id="six_months"
        >
          6M
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(365, 'one_year')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
            activeFilter === 'one_year' ? 'active' : ''
          }`}
          id="one_year"
        >
          1Y
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(10000, 'all')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
            activeFilter === 'all' ? 'active' : ''
          }`}
          id="all"
        >
          ALL
        </button>
      </div>
    );
  };

  if (!loading && chartData.length === 0 && !showMessage) {
    <Col
      className="d-flex text-center col-12 justify-content-center align-items-center"
      style={{ display: 'flex', height: '50vh', width: '100%' }}
    >
      <h1 className="text-center">No data found </h1>
    </Col>;
  }

  return (
    <>
      <div className="border border-2 rounded p-2 mt-4" style={{ zIndex: 1 }}>
        {loading ? (
          <Card className="mb-1" style={{ height: '320px' }}>
            <CardBody className="d-flex justify-content-center align-items-center">
              <Spinner />
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="d-flex align-items-end">
              <h1 className="d-flex align-items-center">{title}</h1>
              <h4
                style={{ marginBottom: '.7rem' }}
                className={`ms-2 text-${subtitle >= 0 ? 'success' : 'danger'}`}
              >
                {subtitle}%
              </h4>
            </div>
            <span className="ms-2 text-muted mb-3">{activeDate}</span>
            <div>
              <Line height={250} data={chartData} options={chartOptions} />
            </div>
          </>
        )}
        <div className="toolbar mb-3">{renderFiltersButtons()}</div>
      </div>
    </>
  );
};
export default PerformanceChart;
