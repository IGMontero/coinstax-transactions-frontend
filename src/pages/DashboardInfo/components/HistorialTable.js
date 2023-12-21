import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
  Spinner,
} from "reactstrap";
import { formatIdTransaction, getActionMapping } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { fetchHistory } from "../../../slices/transactions/thunk";
import eth from "../../../assets/images/svg/crypto-icons/eth.svg";
import RenderTransactions from "./HistorialComponents/RenderTransactions";

const HistorialTable = ({ address, activeTab }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  const [hasMoreData, setHasMoreData] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [groupedTransactions, setGroupedTransactions] = useState({});

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  const formatNumber = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "Invalid Number";
    }

    let formattedNumber = parseFloat(number.toFixed(4));
    return formattedNumber.toString();
  };

  useEffect(() => {
    if (activeTab === "3") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await dispatch(
            fetchHistory({ address, count: 10, page: 0 })
          ).unwrap();
          setData(response);
          setHasMoreData(response.length === 10);
        } catch (error) {
          console.error("Error fetching performance data:", error);
        } finally {
          setIsInitialLoad(false);
          setLoading(false);
        }
      };

      fetchData();
    }
    setCurrentPage(0);
    setHasMoreData(true);
  }, [address, activeTab, dispatch]);

  useEffect(() => {
    const groupByDate = (transactions) => {
      return transactions.reduce((acc, transaction) => {
        const date = formatDate(transaction.date);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {});
    };

    if (data) {
      setGroupedTransactions(groupByDate(data));
    }
  }, [data]);

  const getMoreTransactions = async () => {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await dispatch(
        fetchHistory({ address, count: 10, page: nextPage })
      ).unwrap();
      setData((prevData) => [...prevData, ...response]);
      setHasMoreData(response.length === 10);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error fetching more transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Button color="soft-primary" size="sm">
            Transactions
          </Button>
          <Button color="soft-primary" size="sm" className="ms-2">
            All Assets
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6} md={8} sm={10} xs={12}>
          <InputGroup className="py-3 search-bar col-lg-12 col-md-12 pe-3">
            <span
              className="search-icon ps-3 position-absolute"
              onClick={() => inputRef.current.focus()}
              style={{ zIndex: 1, cursor: "text" }}
            >
              <i className="ri-search-line text-muted fs-3"></i>
            </span>
            <Input
              innerRef={inputRef}
              className="search-input py-2 rounded"
              style={{
                zIndex: 0,
                paddingLeft: "47px",
              }}
              placeholder="Filter by Address, Protocol, Assets, Type"
              // value={searchTerm}
              // onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col
          lg={6}
          md={4}
          sm={2}
          xs={12}
          className="d-flex btn btn-sm py-3 justify-content-end"
        >
          <Button color="primary" size="sm">
            Download CSV
          </Button>
        </Col>
      </Row>
      <Col lg={12} className="position-relative" style={{ minHeight: "50vh" }}>
        {loading && isInitialLoad && (
          <div
            className="position-absolute d-flex justify-content-center align-items-center bg-transparent"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: "blur(5px)",
              zIndex: 2,
            }}
          >
            <Spinner style={{ width: "3rem", height: "3rem" }} />
          </div>
        )}

        <div className="">
          {groupedTransactions &&
            Object.keys(groupedTransactions).map((date, index) => (
              <RenderTransactions
                date={date}
                transactions={groupedTransactions[date]}
              />
            ))}
        </div>
      </Col>
      {hasMoreData && (
        <Col>
          <div className="d-flex justify-content-center mt-2">
            <Button
              disabled={loading}
              onClick={getMoreTransactions}
              color="soft-light"
              style={{ borderRadius: "10px", border: ".5px solid grey" }}
            >
              {loading && !isInitialLoad ? (
                <Spinner size="sm" />
              ) : (
                <h6 className="text-dark fw-semibold my-2">
                  More transactions
                </h6>
              )}
            </Button>
          </div>
        </Col>
      )}
    </React.Fragment>
  );
};

export default HistorialTable;
