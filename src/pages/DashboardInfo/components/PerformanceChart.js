import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchPerformance } from '../../../slices/transactions/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, Col, Spinner } from 'reactstrap';
import {
  CurrencyUSD,
  calculateTickAmount,
  getMaxMinValues,
  parseValuesToLocale,
} from '../../../utils/utils';
import AddressWithDropdown from '../../../Components/Address/AddressWithDropdown';

const PerformanceChart = ({
  address,
  series,
  setSeries,
  title,
  subtitle,
  setIsUnsupported,
  loading,
  setLoading,
  type,
}) => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('one_week');

  const [showMessage, setShowMessage] = useState(false);

  const [options, setOptions] = useState({
    chart: {
      type: 'line',
      height: 350,
      maxWidth: '100%',
      minWidth: '100%',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
    },
    title: {
      text: '',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '36px',
        fontWeight: 'semibold',
      },
    },
    subtitle: {
      text: '',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 45,
      floating: false,
      style: {
        fontSize: '15px',
        fontWeight: 'normal',
        color: ``,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tooltip: {
        enabled: false,
      },
      labels: {
        formatter: function (value) {
          return value.toLocaleString();
        },
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: function (value) {
          return '' + value;
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = parseValuesToLocale(
          series[seriesIndex][dataPointIndex],
          CurrencyUSD,
        );
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const prettyDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });
        return `<div class="p-2 fw-semibold text-dark"> ${value}
          <div class="apexcharts-tooltip-text fs-6 text-muted ">${prettyDate} </div></div>`;
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
            const lineData = response.total.map((item) => ({
              date: item.calendarDate,
              x: new Date(item.calendarDate).getTime(),
              y: item.close.quote,
            }));
            setSeries([{ data: lineData }]);
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
    fetchAndSetData();
  }, [address, dispatch]);

  useEffect(() => {
    if (series.length > 0 && series[0].data.length > 0) {
      setOptions((prevOptions) => {
        return {
          ...prevOptions,
          title: {
            ...prevOptions.title,
            text: title,
            style: {
              ...prevOptions.title.style,
              color: '#878a99',
            },
          },
          subtitle: {
            ...prevOptions.subtitle,
            text: subtitle,
            style: {
              ...prevOptions.subtitle.style,
              color: subtitle[0] == '+' ? '#3ac47d' : '#f1556c',
            },
          },
        };
      });
    }
  }, [series, type, title, subtitle]);

  useEffect(() => {
    const newOptions = {
      ...options,
      xaxis: {
        ...options.xaxis,
        labels: {
          ...options.xaxis.labels,
          formatter: function (value, timestamp, index) {
            const date = new Date(timestamp);
            if (activeFilter === 'one_week') {
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
              });
            } else if (
              activeFilter === 'one_month' ||
              activeFilter === 'six_months'
            ) {
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            } else if (activeFilter === 'one_year' || activeFilter === 'all') {
              return date.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              });
            }
          },
          show: true,
        },
        tickAmount: calculateTickAmount(activeFilter),
      },
    };
    setOptions(newOptions);
  }, [activeFilter]);

  const handleFilterForDays = (days, filterId) => {
    fetchAndSetData(days);
    setActiveFilter(filterId);
  };

  useEffect(() => {
    if (series.length > 0 && series[0].data.length > 0) {
      const { minValue, maxValue } = getMaxMinValues(series);

      setOptions((prevOptions) => ({
        ...prevOptions,
        yaxis: {
          ...prevOptions.yaxis,
          min: minValue,
          max: maxValue,
          forceNiceScale: false,
          labels: {
            ...prevOptions.yaxis.labels,
            show: true,

            formatter: (value) => {
              if (value === minValue || value === maxValue) {
                return parseValuesToLocale(value, CurrencyUSD);
              }
              return '';
            },
          },
        },
      }));
    }
  }, [series]);

  const renderFiltersButtons = () => {
    return (
      <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-1 p-2">
        <button
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

  useEffect(() => {
    if (!series.length) {
      setShowMessage(true);
      // setIsUnsupported(true);
    }
  }, [series]);

  if (
    !loading &&
    series.length === 0 &&
    showMessage &&
    !showMessage &&
    !loading
  ) {
    <Col
      className="d-flex text-center col-12 justify-content-center align-items-center"
      style={{ display: 'flex', height: '50vh', width: '100%' }}
    >
      <h1 className="text-center">No data found </h1>
    </Col>;
  }

  return (
    <div
      style={{
        marginTop: loading ? '-1rem' : '-2rem',
      }}
    >
      <AddressWithDropdown />
      <h1 className={`ms-1 mt-4 mb-4 `}>Performance Chart</h1>
      <div className="position-relative">
        {loading ? (
          <Card className="mt-3">
            <CardBody className="p-5 pb-4">
              <div style={{ backgroundColor: '#212529', height: '353px' }}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner color="white" />
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="border border-2 rounded p-2" style={{ zIndex: 1 }}>
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={350}
            />
            {renderFiltersButtons()}
          </div>
        )}
      </div>
    </div>
  );
};
export default PerformanceChart;
