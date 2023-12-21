import React, { useState } from "react";
import { formatIdTransaction, getActionMapping } from "../../../../utils/utils";
import { Col, Row, Collapse, CardBody } from "reactstrap";

import eth from "../../../../assets/images/svg/crypto-icons/eth.svg";
import ListTransactions from "./ListTransactions";

const RenderTransactions = ({ date, transactions }) => {
  const ACTION_EXECUTE = "EXECUTE";
  const ACTION_WITHDRAW = "WITHDRAW";
  const ACTION_TRADE = "TRADE";
  const ACTION_APRPROVE = "APPROVE";
  const ACTION_RECEIVE = "RECEIVE";

  const [openCollapse, setopenCollapse] = useState(new Set());

  const [copiedIndex, setCopiedIndex] = useState(null);

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

  function capitalizeFirstLetter(text) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

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

  return (
    <React.Fragment>
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
                      className={`rounded-circle position-relative align-items-center border me-3 d-flex justify-content-center border-${
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
                      <img
                        src={eth}
                        alt="Ethereum"
                        className="position-absolute"
                        style={{
                          bottom: "-3px",
                          right: "-2px",
                          width: "15px",
                          height: "15px",
                        }}
                      />
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
                  sm={8}
                  xs={7}
                  className="d-flex align-items-center "
                  style={{ overflow: "hidden" }}
                >
                  {transaction.ledgers &&
                    transaction.ledgers.length > 0 &&
                    transaction.blockchainAction !== ACTION_EXECUTE && (
                      <>
                        <img
                          src={transaction.ledgers[0].txInfo?.logo || ""}
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
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {transaction.ledgers[0].amount > 0 ? "+" : ""}
                            {formatNumber(transaction.ledgers[0].amount)}{" "}
                            {transaction.ledgers[0].currency}
                          </h6>
                          <p className="text-start my-0">
                            {transaction.price >= 0 ? "N/A" : transaction.price}
                          </p>
                        </div>
                      </>
                    )}
                </Col>

                <Col
                  lg={3}
                  md={3}
                  className="d-flex justify-content-start d-none d-lg-flex"
                >
                  {transaction.ledgers &&
                    transaction.ledgers.length > 1 &&
                    (transaction.blockchainAction === ACTION_WITHDRAW ||
                      transaction.blockchainAction === ACTION_TRADE) && (
                      <div className="d-flex align-items-center">
                        <i className="ri-arrow-right-line text-end fs-4 me-1"></i>
                        <h6 className="fw-semibold my-0 d-flex align-items-center justify-content-center">
                          {transaction.ledgers.length - 2 === 1 ? (
                            <>
                              <img
                                src={transaction.ledgers[0].txInfo?.logo}
                                alt={transaction.ledgers[0].txInfo?.name}
                                className="me-1"
                                width={35}
                                height={35}
                              />
                              <div className="d-flex flex-column">
                                {formatNumber(transaction.ledgers[0].amount)}{" "}
                                {transaction.ledgers[0].currency}
                                <p className="text-start my-0 text-muted">
                                  {transaction.price >= 0
                                    ? "N/A"
                                    : transaction.price}
                                </p>
                              </div>
                            </>
                          ) : (
                            `${transaction.ledgers.length - 2} Assets`
                          )}
                        </h6>
                      </div>
                    )}
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={4}
                  xs={5}
                  className="d-flex justify-content-end align-items-center  "
                >
                  <div className="d-flex flex-column text-start justify-content-end  me-3">
                    <p className="text-start my-0">
                      {" "}
                      {transaction.blockchainAction === ACTION_RECEIVE
                        ? "From"
                        : transaction.blockchainAction === ACTION_EXECUTE ||
                          transaction.blockchainAction === ACTION_TRADE ||
                          transaction.blockchainAction === ACTION_APRPROVE ||
                          transaction.blockchainAction === ACTION_WITHDRAW
                        ? "Contract Address:"
                        : "To"}
                    </p>
                    <h6 className="fw-semibold my-0 text-start d-flex align-items-center">
                      {" "}
                      {transaction.blockchainAction == ACTION_RECEIVE
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
                  {/* CODE FOR LIST */}
                  {transaction.ledgers &&
                    transaction.ledgers.length - 2 >= 2 &&
                    (transaction.blockchainAction === ACTION_WITHDRAW ||
                      transaction.blockchainAction === ACTION_TRADE) && (
                      <ListTransactions transaction={transaction} />
                    )}

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
                            {transaction.blockchainAction == ACTION_RECEIVE
                              ? "N/A"
                              : transaction.fee
                              ? `${transaction.fee} ${transaction.feeCurrency}`
                              : "0.00"}
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

export default RenderTransactions;
