import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchPerformance } from '../../../slices/transactions/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from 'reactstrap';

const PerformanceChart = ({
  address,
  series,
  setSeries,
  title,
  subtitle,
  setIsUnsupported,
  onSearch,
}) => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('one_week');

  const [loading, setLoading] = useState(false);
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
          return '$' + value;
        },
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex].toLocaleString();
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const prettyDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        });
        return `<div class="p-2 fw-semibold text-dark"> $${value}
          <div class="apexcharts-tooltip-text fs-6 text-muted ">${prettyDate} </div></div>`;
      },
    },
  });
  const fetchAndSetData = (days) => {
    if (address) {
      setLoading(true);
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
  }, [series, title, subtitle]);

  const handleFilterForDays = (days, filterId) => {
    fetchAndSetData(days);
    setActiveFilter(filterId);
  };
  return (
    <div className="position-relative ">
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center position-absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            backdropFilter: 'blur(5px)',
            zIndex: 2,
          }}
        >
          <Spinner style={{ width: '4rem', height: '4rem' }} />
        </div>
      )}
      <div
        className="border border-2 rounded p-2 position-relative"
        style={{ zIndex: 1 }}
      >
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
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
      </div>
    </div>
  );
};

export default PerformanceChart;
