import { Chart } from 'chart.js';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Col } from 'reactstrap';
import FilterButtonsChart from '../../../Components/FilterButtons/FilterButtonsChart';
import ChartSkeleton from '../../../Components/Skeletons/ChartSkeleton';
import { selectNetworkType } from '../../../slices/networkType/reducer';
import {
  fetchPerformance,
  fetchPerformanceToken,
} from '../../../slices/transactions/thunk';
import {
  CurrencyUSD,
  calculatePercentageChange,
  filtersChart,
  formatCalendarDateToLocale,
  formatPercentageChange,
  getMaxMinValues,
  parseValuesToLocale,
} from '../../../utils/utils';
import { getBalancesPortfolio } from '../../../slices/portfolio/thunk';
import { useGetTimezone } from '../../../hooks/useUtils';
import { formatTimeForClient } from '../../../utils/date.utils';

const PerformanceChart = ({ address, setIsUnsupported, isUnsupported }) => {
  const dispatch = useDispatch();
  const { token, userId } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const currentPortfolioUserId = userId ? userId : user?.id;
  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const fetchControllerRef = useRef(new AbortController());

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const networkType = useSelector(selectNetworkType);

  const [loadingChart, setLoadingChart] = useState({});

  const timezone = useGetTimezone();

  const loading =
    (isInitialLoad && !token) || Object.values(loadingChart).some((l) => l);
  // const loading = true;
  const [activeFilter, setActiveFilter] = useState('one_week');
  const [isHovering, setIsHovering] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('default');
  const [showMessage, setShowMessage] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Performance',
        data: [0],
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
          legend: {
            display: false,
          },
          time: {
            parser: 'YYYY-MM-DD',
            tooltipFormat: 'll',
            unit: 'day',
            timezone: timezone,
            displayFormats: {
              day: 'MMM DD',
            },
          },
          ticks: {
            // source: 'data',
            autoSkip: true,
            maxTicksLimit: 10,
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

            const percentageChangeFormatted =
              formatPercentageChange(percentageChange);

            setSubtitle(percentageChangeFormatted);

            const date =
              formatTimeForClient(data.labels[index], timezone, 'calendar');
            setActiveDate(date);
          }
          return '';
        },
        label: function (tooltipItem) {
          return `${parseValuesToLocale(tooltipItem.yLabel, CurrencyUSD)}`;
        },
        footer: function (tooltipItems, data) {
          // Show date formatted

          const dataLabel = data.labels[tooltipItems[0].index];

          const date = moment(dataLabel).format('YYYY-MM-DD');
          const dateObj = moment(date).toDate();

          return formatTimeForClient(dateObj, timezone, 'date');
        },

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

    options: {
      plugins: {
        legend: {
          display: false,
        }
      }

    }
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

  const fetchAndSetData = (days, signal, applyDelay) => {
    const fetchId = Date.now();
    let timer;

    if (address || isCurrentUserPortfolioSelected) {
      const params = days
        ? { address, days, networkType, signal }
        : { address, networkType, signal };

      if (timezone) {
        params.tz = timezone;
      }

      if (applyDelay) {
        timer = setTimeout(() => {
          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: true,
          }));
        }, 300);
      } else {
        setLoadingChart((prev) => ({
          ...prev,
          [fetchId]: true,
        }));
      }

      const request = isCurrentUserPortfolioSelected
        ? getBalancesPortfolio({
          userId: currentPortfolioUserId,
          blockchain: networkType,
          days,
          signal,
          tz: timezone,
        })
        : fetchPerformance(params);

      dispatch(request)
        .unwrap()
        .then((response) => {
          clearTimeout(timer);
          const newLabels = response.total.map((item) =>
            moment(item.calendarDate).format('YYYY-MM-DD'),
          );
          const newData = response.total.map((item) => {
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
          const numTicks = 2;
          const tolerance = range / 10;
          const allItemsAreIntegers = newData.every((item) =>
            Number.isInteger(item),
          );

          let yAxesOptions;

          if (newData.length === 0 || newData.every((val) => val === 0)) {
            yAxesOptions = {
              min: -1,
              max: 1,
              maxTicksLimit: 1,
              autoSkip: false,
              ticks: {
                callback: function (value) {
                  if (value === 0) {
                    return parseValuesToLocale(value, CurrencyUSD);
                  }
                  return '';
                },
              },
            };
          } else {
            yAxesOptions = {
              min: minTick,
              max: maxTick,
              maxTicksLimit: 2,
              autoSkip: true,
              callback: function (value) {
                if (allItemsAreIntegers) {
                  if (value === minValue || value === maxValue) {
                    return parseValuesToLocale(value, CurrencyUSD, true);
                  }
                } else {
                  if (
                    Math.abs(value - minValue) < tolerance ||
                    Math.abs(value - maxValue) < tolerance
                  ) {
                    return parseValuesToLocale(value, CurrencyUSD, true);
                  }
                }
                return '';
              },
            };
          }

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

          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: false,
          }));
        })
        .catch((error) => {
          clearTimeout(timer);
          console.error('Error fetching performance data:', error);
          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: false,
          }));
        })
        .finally(() => {
          setIsInitialLoad(false);
        });
    }
  };

  const fetchAndSetDataForToken = (days, signal, applyDelay) => {
    const fetchId = Date.now();
    let timer;
    if (address) {
      const params = days ? { address, days, signal } : { address, signal };

      if (applyDelay) {
        timer = setTimeout(() => {
          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: true,
          }));
        }, 300);
      } else {
        setLoadingChart((prev) => ({
          ...prev,
          [fetchId]: true,
        }));
      }
      dispatch(fetchPerformanceToken(params))
        .unwrap()
        .then((response) => {
          clearTimeout(timer);

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
          const maxTick = maxValue;

          setChartData({
            labels: newLabels,
            datasets: [{ ...chartData.datasets[0], data: newData }],
          });

          const range = maxValue - minValue;
          const numTicks = 2;
          const tolerance = 0.001;

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
                    callback: function (value) {
                      if (
                        Math.abs(value - minValue) < tolerance ||
                        Math.abs(value - maxValue) < tolerance
                      ) {
                        return parseValuesToLocale(value, CurrencyUSD, true);
                      }
                      return '';
                    },
                  },
                },
              ],
            },
          }));

          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: false,
          }));
        })
        .catch((error) => {
          clearTimeout(timer);
          console.error('Error fetching performance data:', error);
          setLoadingChart((prev) => ({
            ...prev,
            [fetchId]: false,
          }));
        });
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
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
    }
  }, [chartData, networkType, chartOptions, isUnsupported]);

  // #region Handlers
  const handleFilterForDays = (days, filterId) => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;
    if (token) {
      fetchAndSetDataForToken(days, signal, true);
    } else {
      fetchAndSetData(days, signal, true);
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

    const percentageChangeFormatted = formatPercentageChange(percentageChange);

    setSubtitle(percentageChangeFormatted);
    const date = moment(chartData.labels[index]).format('YYYY-MM-DD');
    setActiveDate(formatCalendarDateToLocale(date));
  };

  // #region UseEffects
  useEffect(() => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    if (token) {
      fetchAndSetDataForToken(7, signal, false);
    } else {
      fetchAndSetData(7, signal, false);
    }
    setActiveFilter('one_week');

    return () => {
      fetchControllerRef.current.abort();
    };
  }, [token, networkType, address]);

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
  }, [isHovering, chartData, networkType, showMessage]);

  useEffect(() => {
    if (!token && chartData.datasets[0].data.length > 0) {
      const lastValue =
        chartData.datasets[0].data[chartData.datasets[0].data.length - 1];
      const firstValue = chartData.datasets[0].data[0];
      const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
      const percentageChangeFormatted =
        formatPercentageChange(percentageChange);
      setSubtitle(percentageChangeFormatted);
      setDiferenceValue(lastValue - firstValue);
    }
  }, [chartData, networkType, token]);

  // #region Renders
  const renderFiltersButtons = () => {
    return (
      <>
        <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 p-2">
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
      </>
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
            <div className={loading ? (token ? ' mt-0 mb-4' : '') : ''}></div>
            <div className="border border-1 p-3 mt-4" style={{borderRadius: '16px', maxHeight: '260px'}}>
              <div
                className="chart-container position-relative"
                style={{
                  zIndex: 1,
                  height: '40vh',
                  width: '99%',
                  maxHeight: '340px',
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
                      zIndex: 2,
                      height: '50vh',
                      maxHeight: '340px',
                    }}
                  >
                    {/* <Spinner
                      style={{ width: '4rem', height: '4rem' }}
                      className=""
                    /> */}
                    <ChartSkeleton />
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-center w-100 mb-3">
                      <div className='d-flex align-items-start flex-column w-100'>
                        <div className='d-flex align-items-center w-100 justify-content-between'>
                          <h1 className="d-flex align-items-center">{title}</h1>
                          <div className={`d-flex`}>{renderFiltersButtons()}</div>{' '}
                        </div>
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
                    </div>
                    {token && (
                      <span className="text-muted mb-3">{activeDate}</span>
                    )}
                    <div>
                    <canvas ref={chartContainerRef} />
                    </div>
                  </>
                )}
              </div>
              
            </div>
          </Col>
        </div>
      </Col>
    </>
  );
};
export default PerformanceChart;
