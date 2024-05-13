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
  const [isHovering, setIsHovering] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('default');
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
        // backgroundColor: '#0758bc1b',
        backgroundColor: 'rgba(7, 88, 188, 0.1)', // Transparent fill color
        pointBackgroundColor: '#0759BC', // Color of the points
        pointBorderColor: '#0759BC', // Border color of the points
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
          position: 'left',
          gridLines: { display: false },
          ticks: {
            display: true,
            align: 'inner',
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
            maxTicksLimit: 7,
            maxRotation: 0, // Set maximum rotation to 0 degrees
            minRotation: 0, // Set minimum rotation to 0 degrees
            // interval: 1,
          },
          label: {
            avoidCollisions: false,
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
        footer: function (tooltipItems, data) {
          // Show date formatted
          const date = new Date(data.labels[tooltipItems[0].index]);
          // console.log(tooltipItems);
          return formatDateToLocale(date, true);
        },
        // label: function (tooltipItem, data) {
        //   // Your label callback logic
        //   const value = tooltipItem.yLabel;
        //   const formattedValue = parseValuesToLocale(value, CurrencyUSD);
        //   const labelHTML = `<div>${formattedValue}</div>`; // HTML markup for the tooltip label
        //   return labelHTML;
        // },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
      onHover: (event, chartElements) => {
        if (chartElements.length > 0) {
          setIsHovering(true);
          setCursorStyle('default');
        } else {
          setIsHovering(false);
          setCursorStyle('default');
        }
      },
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

    // layout: {
    //   padding: {
    //     left: -10,
    //     right: -10,
    //     top: 0,
    //     bottom: 0,
    //   },
    // },
  });

  // #region Api Calls
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

            console.log('New data:', newData);

            const minTick = minValue - Math.abs(maxValue - minValue) / 2;
            const maxTick = maxValue + Math.abs(maxValue - minValue) / 2;

            console.log('minValue maxValue', minValue, maxValue);

            setChartData({
              labels: newLabels,
              datasets: [{ ...chartData.datasets[0], data: newData }],
            });

            const range = maxValue - minValue;
            const numTicks = 5; // Adjust this value based on your preference
            // const tolerance = 0.1; // Adjust as needed for your precision

            // Calculate tolerance based on the difference of consecutive values
            const tolerance = range / 10;

            const allItemsAreIntegers = newData.every((item) =>
              Number.isInteger(item),
            );

            const stepSize = range / (numTicks - 1);

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
                      stepSize: allItemsAreIntegers ? 1 : stepSize,
                      callback: function (value) {
                        if (allItemsAreIntegers) {
                          if (value === minValue || value === maxValue) {
                            return parseValuesToLocale(value, CurrencyUSD);
                          }
                        } else {
                          if (
                            Math.abs(value - minValue) < tolerance ||
                            Math.abs(value - maxValue) < tolerance
                          ) {
                            return parseValuesToLocale(value, CurrencyUSD);
                          }
                        }

                        return ''; // Return empty string for other values
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
              // const dateString = date.toISOString();
              // .split('T')[0];

              // if (!uniqueDates.has(dateString)) {
              //   uniqueDates.add(dateString);
              //   newLabels.push(dateString); // Push dateString if you want labels as YYYY-MM-DD or date for Date objects
              //   newData.push(item[1]);
              // }

              // Add all
              newLabels.push(date);
              newData.push(item[1]);
            });

            console.log('New data length', newData.length);

            const { minValue, maxValue } = getMaxMinValues(newData);
            const minTick = minValue - Math.abs(maxValue - minValue);
            const maxTick = maxValue + Math.abs(maxValue - minValue);

            setChartData({
              labels: newLabels, // Ensure the labels are Date objects if needed
              datasets: [{ ...chartData.datasets[0], data: newData }],
            });

            const range = maxValue - minValue;
            const numTicks = 5; // Adjust this value based on your preference
            const tolerance = 0.001; // Adjust as needed for your precision

            const stepSize = range / (numTicks - 1);

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
                      stepSize: stepSize,
                      callback: function (value) {
                        if (
                          Math.abs(value - minValue) < tolerance ||
                          Math.abs(value - maxValue) < tolerance
                        ) {
                          return parseValuesToLocale(value, CurrencyUSD);
                        }
                        return ''; // Return empty string for other values
                      },
                      // callback: (value, index, values) => {
                      //   // Only display label for the highest value
                      //   if (value === Math.max(...values)) {
                      //     return `${value} (Highest)`;
                      //   }
                      //   return null;
                      // },
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

  // #region Handlers
  const handleFilterForDays = (days, filterId) => {
    if (token) {
      fetchAndSetDataForToken(days);
    } else {
      fetchAndSetData(days);
    }
    setActiveFilter(filterId);
  };

  const updateValues = (index) => {
    const value = chartData.datasets[0].data[index];
    setTitle(parseValuesToLocale(value, CurrencyUSD));
    const percentageChange = calculatePercentageChange(
      index,
      chartData.datasets[0].data,
    );
    setSubtitle(percentageChange.toFixed(2));
    setActiveDate(formatDateToLocale(new Date(chartData.labels[index])));
  };

  // #region UseEffects
  useEffect(() => {
    if (!token) {
      fetchAndSetData();
    } else {
      fetchAndSetDataForToken(7);
    }
  }, [token, address]);

  // This useEffect set the most recent value as the active value
  useEffect(() => {
    if (!isHovering && chartData.datasets[0].data.length > 0) {
      const currentDate = new Date();
      let closestIndex = 0;
      let closestDate = new Date(chartData.labels[0]);
      let closestDiff = Math.abs(currentDate - closestDate);

      for (let i = 1; i < chartData.labels.length; i++) {
        const date = new Date(chartData.labels[i]);
        const diff = Math.abs(currentDate - date);
        if (diff < closestDiff) {
          closestIndex = i;
          closestDate = date;
          closestDiff = diff;
        }
      }
      updateValues(closestIndex);
    }
  }, [isHovering, chartData, showMessage]);

  // #region Renders
  const renderFiltersButtons = () => {
    return (
      <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-1 p-2">
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(7, 'one_week')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${activeFilter === 'one_week' ? 'active' : ''
            }`}
          id="one_week"
        >
          7D
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(30, 'one_month')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${activeFilter === 'one_month' ? 'active' : ''
            }`}
          id="one_month"
        >
          1M
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(180, 'six_months')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${activeFilter === 'six_months' ? 'active' : ''
            }`}
          id="six_months"
        >
          6M
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(365, 'one_year')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${activeFilter === 'one_year' ? 'active' : ''
            }`}
          id="one_year"
        >
          1Y
        </button>
        <button
          disabled={loading}
          onClick={() => handleFilterForDays(10000, 'all')}
          type="button"
          className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${activeFilter === 'all' ? 'active' : ''
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
            <div style={{ cursor: cursorStyle }}>
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
