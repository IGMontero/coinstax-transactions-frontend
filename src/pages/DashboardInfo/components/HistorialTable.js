import React, { useRef, useState } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  InputGroup,
  Collapse,
  CardBody,
} from "reactstrap";
import { getActionMapping } from "../../../utils/utils";

const HistorialTable = ({ data }) => {
  const inputRef = useRef(null);
  const [openCollapse, setOpenCollapse] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const toggleCollapse = (index) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  const formatTransactionHash = (
    address,
    prefixLength = 4,
    suffixLength = 4
  ) => {
    if (!address || typeof address !== "string") {
      return null;
    }

    const prefix = address.slice(0, prefixLength + 2);
    const suffix = address.slice(-suffixLength);

    return `${prefix}...${suffix}`;
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
      console.log("Text copied to clipboard");
      setCopiedIndex(index);
    } catch (err) {
      console.error("Failed to copy: ", err);
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
      <Col lg={12}>
        {data &&
          data?.map((transaction, index) => (
            <div key={index} className="align-items-center">
              <Col
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="d-flex justify-content-start pt-4 pb-1 align-items-center"
              >
                <div className="d-flex justify-content-center ps-2 align-items-center">
                  <h6 className="fw-semibold">
                    {formatDate(transaction.date)}
                  </h6>
                </div>
              </Col>
              <div
                className={`border-top border-bottom bg-transparent${
                  openCollapse === index
                    ? " border border-primary rounded"
                    : " bg-light"
                }`}
              >
                <Row
                  className={`align-items-center justify-content-between p-3 `}
                  onClick={() => toggleCollapse(index)}
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
                          width: "45px",
                          minWidth: "45px",
                          height: "45px",
                          minHeight: "45px",
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
                        {transaction.blockchainAction}
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
                    <div className="d-flex flex-column text-center justify-content-end">
                      <h6
                        className={`fw-semibold my-0 ms-2 ${
                          transaction.ledgers[0].amount < 0
                            ? "text-dark"
                            : "text-success"
                        }`}
                      >
                        {formatNumber(transaction.ledgers[0].amount)}
                      </h6>
                      <p
                        className="text-start my-0"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {" "}
                        {/* {transaction.info} */}
                      </p>
                    </div>
                  </Col>

                  <Col
                    lg={3}
                    md={3}
                    className="d-flex justify-content-center d-none d-lg-flex"
                  >
                    <h6 className="fw-semibold my-0 d-flex align-items-center">
                      <div className="justify-content-end ">
                        <i className="ri-arrow-right-line text-end fs-4 me-2"></i>
                      </div>{" "}
                      {transaction.fee}
                    </h6>
                  </Col>
                  <Col
                    lg={3}
                    md={3}
                    sm={6}
                    xs={9}
                    className="d-flex justify-content-end align-items-center  "
                  >
                    {/* <img
                      src={transaction.img3}
                      alt=""
                      className="me-2"
                      style={{ borderRadius: "50%" }}
                      width={40}
                      height={40}
                    /> */}
                    <div className="d-flex flex-column text-start justify-content-end me-3">
                      <p className="text-start my-0">From</p>
                      <h6 className="fw-semibold my-0 text-start">
                        {" "}
                        {transaction.ledgers[0].txInfo.name}
                      </h6>
                    </div>
                  </Col>
                </Row>
                <Collapse isOpen={openCollapse === index}>
                  <CardBody
                    onClick={() => toggleCollapse(index)}
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
                                    ? formatTransactionHash(transaction.txHash)
                                    : "0"}
                                  <i className="ri-arrow-right-up-line fs-6"></i>
                                </span>
                              </div>
                            </div>

                            <div>
                              <button
                                className="btn btn-light p-0  border-0 "
                                style={{ zIndex: 2 }}
                                onClick={(e) => {
                                  handleCopy(e, transaction.txHash, index);
                                  setTimeout(() => {
                                    setCopiedIndex(null);
                                  }, 10000);
                                }}
                              >
                                {copiedIndex === index ? (
                                  <i className="ri-check-line ms-2 fs-4 text-dark"></i>
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
          ))}
      </Col>
    </React.Fragment>
  );
};

export default HistorialTable;
