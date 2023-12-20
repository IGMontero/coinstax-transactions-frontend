import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
} from "reactstrap";
import { formatIdTransaction, getActionMapping } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { fetchHistory } from "../../../slices/transactions/thunk";

const HistorialTable = ({ address }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [openCollapse, setopenCollapse] = useState(new Set());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [groupedTransactions, setGroupedTransactions] = useState({});

  const toggleCollapse = (id) => {
    setopenCollapse((prevopenCollapse) => {
      const newopenCollapse = new Set(prevopenCollapse);
      if (newopenCollapse.has(id)) {
        newopenCollapse.delete(id);
      } else {
        newopenCollapse.add(id);
      }
      return newopenCollapse;
    });
  };

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

  const handleCopy = async (e, text, index) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchHistory(address)).unwrap();
        setData(response);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
      setLoading(false);
    };

    if (address) {
      fetchData();
    }
  }, [address, dispatch]);

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

  function capitalizeFirstLetter(text) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  console.log(data);

  const renderTransactionsGroupByDate = (date, transactions) => {
    return (
      <React.Fragment>
        {/* <h6 className="fw-semibold">{date}</h6> */}
        <Col
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-start pt-4   align-items-center"
        >
          <div className="d-flex justify-content-start ps-2 align-items-center border-bottom w-100">
            <h6 className="fw-semibold text-start mb-3">{date}</h6>
          </div>
        </Col>
        {transactions.map((transaction, index) => {
          const collapseId = `${date}-${index}`;

          return (
            <div key={index} className="align-items-center">
              <div
                className={` border-bottom bg-transparent ${
                  openCollapse.has(collapseId)
                    ? "border border-primary rounded mb-2"
                    : "bg-light"
                }`}
              >
                <Row
                  className={`align-items-center justify-content-between p-3 `}
                  onClick={() => toggleCollapse(collapseId)}
                  style={{ cursor: "pointer" }}
                >
                  <Col
                    lg={3}
                    md={3}
                    sm={12}
                    xs={12}
                    className="d-flex align-items-center mb-lg-0 mb-2"
                  >
                    {transaction.blockchainAction && (
                      <span
                        className={`rounded-circle align-items-center border me-3 d-flex justify-content-center border-${
                          getActionMapping(transaction.blockchainAction).color
                        } text-${
                          getActionMapping(transaction.blockchainAction).color
                        }`}
                        style={{
                          width: "35px",
                          minWidth: "35px",
                          height: "35px",
                          minHeight: "35px",
                        }}
                      >
                        <i
                          className={`${
                            getActionMapping(transaction.blockchainAction).icon
                          } fs-2`}
                        ></i>
                      </span>
                    )}

                    <div className="d-flex flex-column text-start justify-content-end">
                      <h6 className="fw-semibold my-0 fs-8">
                        {" "}
                        {capitalizeFirstLetter(transaction.blockchainAction)}
                      </h6>
                      <p className="text-start my-0">
                        {formatTime(transaction.date)}
                      </p>
                    </div>
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    sm={6}
                    xs={3}
                    className="d-flex align-items-center "
                  >
                    <img
                      src={
                        transaction.ledgers[0] &&
                        transaction.ledgers[0].txInfo &&
                        transaction.ledgers[0].txInfo.logo
                          ? transaction.ledgers[0].txInfo.logo
                          : ""
                      }
                      alt=""
                      className="me-0"
                      width={40}
                      height={40}
                    />
                    <div className="d-flex flex-column text-center justify-content-end ms-2 ">
                      <h6
                        className={`fw-semibold my-0 ${
                          transaction.ledgers[0].amount < 0
                            ? "text-dark"
                            : "text-success"
                        }`}
                      >
                        {transaction.ledgers[0].amount > 0 ? "+" : ""}
                        {formatNumber(transaction.ledgers[0].amount)}{" "}
                        {transaction.ledgers[0].currency}
                      </h6>
                      <p className="text-start my-0">
                        {transaction.price >= 0 ? "N/A" : transaction.price}
                      </p>
                    </div>
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    className="d-flex justify-content-center d-none d-lg-flex"
                  >
                    {/* <h6 className="fw-semibold my-0 d-flex align-items-center">
                      <div className="justify-content-end ">
                        <i className="ri-arrow-right-line text-end fs-4 me-2"></i>
                      </div>{" "}
                      {transaction.fee}
                    </h6> */}
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={6}
                    xs={9}
                    className="d-flex justify-content-end align-items-center  "
                  >
                    <div className="d-flex flex-column text-start justify-content-end  me-3">
                      <p className="text-start my-0">
                        {" "}
                        {transaction.blockchainAction == "RECEIVE"
                          ? "From"
                          : "To"}
                      </p>
                      <h6 className="fw-semibold my-0 text-start d-flex align-items-center">
                        {" "}
                        {transaction.blockchainAction == "RECEIVE"
                          ? formatIdTransaction(transaction.sender, 4, 4)
                          : formatIdTransaction(transaction.recipient, 4, 4)}
                        <i className="ri-arrow-right-up-line fs-5 text-muted ms-1 "></i>
                      </h6>
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={openCollapse.has(collapseId)}>
                  <CardBody
                    onClick={() => toggleCollapse(collapseId)}
                    className={`ps-2 cursor-pointer ${
                      openCollapse === index ? "border-info" : ""
                    }`}
                  >
                    {/* cODIGO COMENTADO */}

                    <Col lg={12}>
                      <Row className="d-flex flex-row align-items-center">
                        <Col lg={12} className="p-2 d-flex ">
                          {transaction.collection && (
                            <div className="p-2 mx-2 d-flex flex-column">
                              <strong className="mb-1">Collection:</strong>
                              <span>
                                {transaction.collection
                                  ? transaction.collection
                                  : "0"}
                              </span>
                            </div>
                          )}

                          <div className="p-2 mx-2 d-flex flex-column">
                            <strong className="mb-1">Fee:</strong>
                            <span>
                              {transaction.fee ? transaction.fee : "0.00"}
                            </span>
                          </div>

                          <div className="align-items-center d-flex">
                            <div className="p-2 d-flex flex-column">
                              <strong>Transaction Hash:</strong>
                              <div className="d-flex">
                                <span className="ms-1d -flex align-items-center">
                                  {transaction.txHash
                                    ? formatIdTransaction(
                                        transaction.txHash,
                                        4,
                                        4
                                      )
                                    : "0"}
                                  <i className="ri-arrow-right-up-line fs-6"></i>
                                </span>
                              </div>
                            </div>

                            <div>
                              <button
                                className="btn btn-light p-0  border-0 "
                                onClick={(e) =>
                                  handleCopy(e, transaction.txHash, collapseId)
                                }
                              >
                                {copiedIndex === collapseId ? (
                                  <i className="ri-check-line mx-2 fs-4 text-dark"></i>
                                ) : (
                                  <i className="ri-file-copy-line mx-2 fs-4 text-dark"></i>
                                )}
                              </button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </CardBody>
                </Collapse>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
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
      <Col lg={12}>
        {Object.keys(groupedTransactions).map((date, index) =>
          renderTransactionsGroupByDate(date, groupedTransactions[date])
        )}
      </Col>
      <Col>
        <div className="d-flex justify-content-center mt-2">
          <Button
            color="soft-light"
            style={{ borderRadius: "10px", border: ".5px solid grey" }}
          >
            <h6 className="text-dark fw-semibold my-2 ">More transactions</h6>
          </Button>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default HistorialTable;
