import React, { useState, useEffect } from "react";
import { formatIdTransaction, getActionMapping } from "../../../../utils/utils";
import { Col, Row, Collapse, CardBody } from "reactstrap";

import eth from "../../../../assets/images/svg/crypto-icons/eth.svg";
import assetsIcon from "../../../../assets/images/svg/assets.svg";
import ListTransactions from "./ListTransactions";
import { Link } from "react-router-dom";

const blockchainActions = {
  EXECUTE: "EXECUTE",
  WITHDRAW: "WITHDRAW",
  TRADE: "TRADE",
  APPROVE: "APPROVE",
  RECEIVE: "RECEIVE",
  SEND: "SEND",
};

const RenderTransactions = ({ date, transactions }) => {
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
        if (!transaction.ledgers) {
          return null;
        }
        const positiveLedgers = transaction.ledgers.filter(
          (ledger) =>
            (ledger.isFee &&
              transaction.blockchainAction === blockchainActions.APPROVE) ||
            (!ledger.isFee && ledger.amount > 0)
        );
        const negativeLedgers = transaction.ledgers.filter(
          (ledger) =>
            (ledger.isFee &&
              transaction.blockchainAction === blockchainActions.APPROVE) ||
            (!ledger.isFee && ledger.amount < 0)
        );

        const allLedgers = positiveLedgers.concat(negativeLedgers);

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

                {(blockchainActions.RECEIVE === transaction.blockchainAction ||
                  blockchainActions.SEND === transaction.blockchainAction) &&
                  allLedgers.map((ledger, index) => (
                    <Col
                      lg={3}
                      md={3}
                      sm={8}
                      xs={7}
                      key={index}
                      className="d-flex align-items-center"
                      style={{ overflow: "hidden" }}
                    >
                      <>
                        <img
                          src={ledger.txInfo?.logo || ""}
                          alt=""
                          className="me-0"
                          width={35}
                          height={35}
                        />
                        <div className="d-flex flex-column text-center justify-content-end ms-2">
                          <h6
                            className={`fw-semibold my-0 text-${
                              ledger.amount > 0 ? "success" : "dark"
                            }`}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {ledger.amount > 0
                              ? `+${formatNumber(ledger.amount)} ${
                                  ledger.currency
                                }`
                              : `${formatNumber(ledger.amount)} ${
                                  ledger.currency
                                }`}
                          </h6>
                          <p className="text-start my-0">
                            {transaction.price >= 0 ? "N/A" : transaction.price}
                          </p>
                        </div>
                      </>
                    </Col>
                  ))}
                {(transaction.blockchainAction === blockchainActions.WITHDRAW ||
                  transaction.blockchainAction === blockchainActions.TRADE ||
                  transaction.blockchainAction === blockchainActions.APPROVE) &&
                  negativeLedgers.length > 0 && (
                    <Col
                      lg={3}
                      md={3}
                      sm={8}
                      xs={7}
                      className="d-flex align-items-center"
                      style={{ overflow: "hidden" }}
                    >
                      <>
                        {negativeLedgers.length === 1 ? (
                          <>
                            <img
                              src={negativeLedgers[0].txInfo?.logo || ""}
                              alt=""
                              className="me-0"
                              width={35}
                              height={35}
                            />
                            <div className="d-flex flex-column text-center justify-content-end ms-2">
                              <h6
                                className="fw-semibold my-0 text-dark"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {formatNumber(negativeLedgers[0].amount)}{" "}
                                {negativeLedgers[0].currency}
                              </h6>
                              <p className="text-start my-0">
                                {transaction.blockchainAction ===
                                blockchainActions.APPROVE
                                  ? "Unlimited"
                                  : transaction.price >= 0
                                  ? "N/A"
                                  : transaction.price}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-primary rounded-circle align-items-center justify-content-center d-flex">
                              <img
                                src={assetsIcon}
                                alt=""
                                className="p-1"
                                width={35}
                                height={35}
                              />
                            </div>
                            <div className="ms-2 ">
                              {negativeLedgers.length} Assets
                            </div>
                          </>
                        )}
                      </>
                    </Col>
                  )}
                <Col
                  lg={3}
                  md={3}
                  className="d-flex justify-content-start d-none d-lg-flex"
                >
                  {(transaction.blockchainAction ===
                    blockchainActions.WITHDRAW ||
                    transaction.blockchainAction === blockchainActions.TRADE) &&
                    positiveLedgers.length > 0 && (
                      <div className="d-flex align-items-center">
                        <i className="ri-arrow-right-line text-dark text-end fs-4 me-1"></i>
                        <h6 className="fw-semibold my-0 d-flex align-items-center justify-content-center">
                          {positiveLedgers.length === 1 ? (
                            <>
                              <img
                                src={positiveLedgers[0].txInfo?.logo}
                                alt={positiveLedgers[0].txInfo?.name}
                                className="me-2"
                                width={35}
                                height={35}
                              />
                              <div className="d-flex flex-column">
                                <span className="text-success">
                                  {" "}
                                  +{formatNumber(
                                    positiveLedgers[0].amount
                                  )}{" "}
                                </span>
                                {positiveLedgers[0].currency}
                                <p className="text-start my-0 text-muted">
                                  {transaction.price >= 0
                                    ? "N/A"
                                    : transaction.price}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-primary rounded-circle align-items-center justify-content-center d-flex">
                                <img
                                  src={assetsIcon}
                                  alt=""
                                  className="p-1"
                                  width={35}
                                  height={35}
                                />
                              </div>
                              <div className="ms-2 ">
                                <span className="text-success">
                                  {positiveLedgers.length} Assets
                                </span>
                                <p className="text-start my-0 text-muted">
                                  {transaction.price >= 0
                                    ? "N/A"
                                    : transaction.price}
                                </p>
                              </div>
                            </>
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
                      {transaction.blockchainAction ===
                      blockchainActions.RECEIVE
                        ? "From"
                        : transaction.blockchainAction ===
                            blockchainActions.EXECUTE ||
                          transaction.blockchainAction ===
                            blockchainActions.TRADE ||
                          transaction.blockchainAction ===
                            blockchainActions.APPROVE ||
                          transaction.blockchainAction ===
                            blockchainActions.WITHDRAW
                        ? "Contract Address:"
                        : "To"}
                    </p>
                    <h6 className="fw-semibold my-0 text-start d-flex align-items-center">
                      {" "}
                      {transaction.blockchainAction == blockchainActions.RECEIVE
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
                    (transaction.blockchainAction ===
                      blockchainActions.WITHDRAW ||
                      transaction.blockchainAction ===
                        blockchainActions.TRADE) && (
                      <ListTransactions transactions={transaction} />
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
                            {transaction.blockchainAction ===
                            blockchainActions.RECEIVE
                              ? "N/A"
                              : transaction.ledgers &&
                                transaction.ledgers.find(
                                  (ledger) => ledger.isFee
                                )
                              ? `${
                                  transaction.ledgers.find(
                                    (ledger) => ledger.isFee
                                  ).amount
                                } ${transaction.feeCurrency}`
                              : "0.00"}
                          </span>
                        </div>

                        <div className="align-items-center d-flex">
                          <div className="p-2 d-flex flex-column">
                            <strong>Transaction Hash:</strong>
                            <div className="d-flex">
                              <span className="ms-1d -flex align-items-center ">
                                {transaction.txHash ? (
                                  <Link
                                    to={`https://etherscan.io/tx/${transaction.txHash}`}
                                    target="_blank"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-decoration-none text-muted  "
                                  >
                                    {" "}
                                    <span className=" text-hover-dark  text-hover-underline">
                                      {formatIdTransaction(
                                        transaction.txHash,
                                        4,
                                        4
                                      )}
                                    </span>
                                  </Link>
                                ) : (
                                  "0"
                                )}
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
