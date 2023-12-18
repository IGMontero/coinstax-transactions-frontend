import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchPerformance } from "../../../slices/transactions/thunk";
import { useDispatch } from "react-redux";
import { Spinner } from "reactstrap";

const PerformanceChart = ({ address }) => {
  const dispatch = useDispatch();
  // const address = "0xdf7caf734b8657bcd4f8d3a64a08cca1d5c878a6";
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const [series, setSeries] = useState([{ data: [] }]);
  const fetchAndSetData = (days) => {
    if (address) {
      setLoading(true);
      const params = days ? { address, days } : { address };
      dispatch(fetchPerformance(params))
        .unwrap()
        .then((response) => {
          const lineData = response.total.map((item) => ({
            x: new Date(item.calendarDate).getTime(),
            y: [
              item.open.quote,
              item.high.quote,
              item.low.quote,
              item.close.quote,
            ],
          }));
          setSeries([{ data: lineData }]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching performance data:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, [address, dispatch]);

  const handleFilterForDays = (days, filterId) => {
    fetchAndSetData(days);
    setActiveFilter(filterId);
  };

  // console.log("series", series);

  const options = {
    chart: {
      // type: "candlestick",
      type: "line",
      height: 350,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00B746",
          downward: "#EF403C",
        },
      },
    },
  };

  return (
    <div>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner style={{ width: "4rem", height: "4rem" }} />
        </div>
      ) : (
        <>
          <ReactApexChart
            options={options}
            series={series}
            // type="candlestick"
            type="line"
            height={350}
          />

          <div className="toolbar d-flex align-items-start justify-content-start flex-wrap gap-2 mt-1">
            <button
              onClick={() => handleFilterForDays(30, "one_month")}
              type="button"
              className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
                activeFilter === "one_month" ? "active" : ""
              }`}
              id="one_month"
            >
              1M
            </button>
            <button
              onClick={() => handleFilterForDays(180, "six_months")}
              type="button"
              className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
                activeFilter === "six_months" ? "active" : ""
              }`}
              id="six_months"
            >
              6M
            </button>
            <button
              onClick={() => handleFilterForDays(365, "one_year")}
              type="button"
              className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
                activeFilter === "one_year" ? "active" : ""
              }`}
              id="one_year"
            >
              1Y
            </button>
            <button
              onClick={() => handleFilterForDays(null, "all")}
              type="button"
              className={`btn btn-soft-primary  rounded-pill  timeline-btn btn-sm  ${
                activeFilter === "all" ? "active" : ""
              }`}
              id="all"
            >
              ALL
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceChart;
