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
  formatNumberWithBillionOrMillion,
  filtersChart,
} from '../../../utils/utils';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { useParams } from 'react-router-dom';
import FilterButtonsChart from '../../../Components/FilterButtons/FilterButtonsChart';
import _ from 'lodash';
import AddressWithDropdown from '../../../Components/Address/AddressWithDropdown';

const PerformanceChart = ({
  address,
  setIsUnsupported,
  loading,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

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
  const [diferenceValue, setDiferenceValue] = useState('0');
  const [activeDate, setActiveDate] = useState('');
  const [chartOptions, setChartOptions] = useState({
    maintainAspectRatio: false,

    scales: {
      yAxes: [
        {
          position: 'left',
          gridLines: { display: false },
          ticks: {
            // display: true,
            // beginAtZero: true,
            padding: 20,
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
            maxTicksLimit: 7,
            maxRotation: 0,
            minRotation: 0,
            padding: 20,
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
          if (tooltipItems.length > 0 && token) {
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
          if (!token) {
            setIsHovering(false);
          } else {
            setIsHovering(true);
          }
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
          const newLabels = response.total.map(
            (item) => new Date(item.calendarDate),
          );
          const newData = response.total.map((item) => {
            // Min value is 0 for all points.
            const result = Math.max(0, item.value.quote);

            return result;
          });
          const { minValue, maxValue } = getMaxMinValues(newData);

          const minTick = minValue;
          const maxTick = maxValue;

          setChartData({
            labels: newLabels,
            datasets: [{ ...chartData.datasets[0], data: newData }],
          });

          const range = maxValue - minValue;
          const numTicks = 2; // Adjust this value based on your preference
          const tolerance = range / 10;
          const allItemsAreIntegers = newData.every((item) =>
            Number.isInteger(item),
          );
          // const stepSize = range / (numTicks - 1);

          let yAxesOptions;

          // Only for 10000 days
          yAxesOptions = {
            min: minTick,
            max: maxTick,
            maxTicksLimit: 2,
            // stepSize: stepSize,
            autoSkip: true,
            // stepSize: allItemsAreIntegers ? 1 : stepSize,
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
          };

          setChartOptions((prevOptions) => ({
            ...prevOptions,
            scales: {
              ...prevOptions.scales,

              yAxes: [
                {
                  ...prevOptions.scales.yAxes[0],
                  ticks: yAxesOptions,
                },
              ],
            },
          }));

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

            const { minValue, maxValue } = getMaxMinValues(newData);
            const minTick = minValue;
            // - Math.abs(maxValue - minValue);
            const maxTick = maxValue;
            //  + Math.abs(maxValue - minValue);

            setChartData({
              labels: newLabels, // Ensure the labels are Date objects if needed
              datasets: [{ ...chartData.datasets[0], data: newData }],
            });

            const range = maxValue - minValue;
            const numTicks = 2; // Adjust this value based on your preference
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
                      maxTicksLimit: 2,
                      // stepSize: stepSize,
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

  useEffect(() => {
    /* The above code is a React useEffect hook that initializes a Chart.js chart inside a canvas
  element. It sets up a debounce function to handle resizing of the chart when the parent container
  is resized. It uses a ResizeObserver to monitor changes in the parent container's size and
  triggers a resize of the chart accordingly. The useEffect hook returns a cleanup function to
  disconnect the ResizeObserver when the component unmounts. */
    const ctx = chartContainerRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
    const debounceResize = _.debounce(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    }, 100);

    const resizeObserver = new ResizeObserver(debounceResize);
    const container = chartContainerRef.current.parentElement;

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
      resizeObserver.disconnect();
    };
  }, [chartData, chartOptions]);

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
    handleFilterForDays(7, 'one_week');
  }, [token, address]);

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

  useEffect(() => {
    if (!token && chartData.datasets[0].data.length > 0) {
      const lastValue =
        chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
      const firstValue = chartData.datasets[0].data[0];
      const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
      setSubtitle(percentageChange.toFixed(2));
      setDiferenceValue(lastValue - firstValue);
    }
  }, [chartData, token]);

  // #region Renders
  const renderFiltersButtons = () => {
    return (
      <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-5 p-2">
        {filtersChart.map((filter) => (
          <FilterButtonsChart
            key={filter.id}
            {...filter}
            loading={loading}
            activeFilter={activeFilter}
            handleFilterForDays={handleFilterForDays}
          />
        ))}
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
      <Col xxl={12} className="mb-4">
        <div className="d-flex justify-content-start">
          <Col className="col-12" style={{ marginTop: '-2rem' }}>
            <div className={loading ? 'pt-3' : ''}>
              {!token && <AddressWithDropdown />}
            </div>
            <div className="border border-2 p-2 mt-4 rounded">
              <div
                className="chart-container position-relative"
                style={{
                  zIndex: 1,
                  height: '40vh',
                  width: '99%',
                }}
              >
                {loading ? (
                  <div
                    className="position-absolute d-flex justify-content-center align-items-center"
                    style={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      // backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      zIndex: 2,
                      backdropFilter: 'blur(10px)',
                      height: '50vh',
                    }}
                  >
                    <Spinner
                      style={{ width: '3rem', height: '3rem' }}
                      color="primary"
                    />
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-column align-items-start">
                      <h1 className="d-flex align-items-center">{title}</h1>
                      <h5
                        className={`mb-2 text-${subtitle >= 0 ? 'success' : 'danger'}`}
                      >
                        {subtitle}%{' '}
                        {!token && (
                          <span>
                            ({parseValuesToLocale(diferenceValue, CurrencyUSD)})
                          </span>
                        )}
                      </h5>
                    </div>
                    <span className="text-muted mb-3">
                      {token && activeDate}
                    </span>
                    <canvas ref={chartContainerRef} />
                  </>
                )}
              </div>
              <div
                className={`${token && loading ? 'pt-3 mt-3' : 'pt-4 mt-4 mb-1'}`}
              >
                {renderFiltersButtons()}
              </div>{' '}
            </div>
          </Col>
        </div>
      </Col>
    </>
  );
};
export default PerformanceChart;
