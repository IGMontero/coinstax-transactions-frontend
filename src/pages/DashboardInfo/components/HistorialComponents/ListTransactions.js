import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";

const ListTransactionss = ({ transactions }) => {
  const [positiveLedgers, setPositiveLedgers] = useState([]);
  const [negativeLedgers, setNegativeLedgers] = useState([]);
  const formatNumber = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "Invalid Number";
    }

    let formattedNumber = parseFloat(number.toFixed(4));
    return formattedNumber.toString();
  };

  useEffect(() => {
    if (transactions && transactions.ledgers) {
      const posLedgers = transactions.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount > 0
      );
      const negLedgers = transactions.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount < 0
      );

      setPositiveLedgers(posLedgers);
      setNegativeLedgers(negLedgers);
    }
  }, [transactions]);
  console.log();
  return (
    <Col xxl={12} lg={12} className="border-top ">
      <Row className="align-items-start g-0 mt-2">
        <Col xxl={12} className="d-flex mb-2"></Col>
        <Col xxl={2} className="d-flex align-items-start flex-column ps-2">
          <span className="mb-3 mt-n2">Sent</span>
          {negativeLedgers &&
            negativeLedgers.map((ledger, index) => (
              <div className="d-flex">
                <img
                  src={ledger.txInfo.logo}
                  alt=""
                  className="me-2"
                  width={35}
                  height={35}
                />
                <div className="d-flex flex-column text-start justify-content-start">
                  <div key={index}>
                    <h6
                      className={`fw-semibold my-0 `}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {ledger.amount > 0 ? "+" : ""}
                      {formatNumber(ledger.amount)} {ledger.currency}
                    </h6>
                    <p>{"N/A"}</p>
                  </div>
                </div>
              </div>
            ))}
        </Col>

        <Col
          xxl={1}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="d-none d-xxl-flex flex-column align-items-center">
            <div className="bg-dark" style={{ width: 0.5, height: 50 }} />
            <div
              style={{
                marginTop: "-12px",
                marginBottom: "-12px",
              }}
            >
              <i className="ri-arrow-right-circle-line text-success fs-1 mb-0 mt-0"></i>
            </div>
            <div className="bg-dark" style={{ width: 0.5, height: 60 }} />
          </div>

          <div className="d-xxl-none d-flex align-items-center flex-row justify-content-center w-100 my-4">
            <div className="bg-dark" style={{ height: 0.5, width: "45%" }} />
            <div
              style={{
                marginTop: "-12px",
                marginBottom: "-12px",
                zIndex: 1,
              }}
            >
              <i className="ri-arrow-down-circle-line text-success fs-1 mb-0 mt-0"></i>
            </div>
            <div className="bg-dark" style={{ height: 0.5, width: "45%" }} />
          </div>
        </Col>

        <Col
          xxl={9}
          className="d-flex align-items-center flex-column justify-content-start"
        >
          <span className="mb-3 mt-n2  align-self-start">Received</span>

          <div className="w-100">
            {positiveLedgers &&
              positiveLedgers.map((ledger, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center w-100 ps-2"
                >
                  <img
                    src={ledger.txInfo.logo}
                    alt="Ledger Image"
                    className="me-2 rounded mb-3"
                    width={35}
                    height={35}
                  />
                  <div className="d-flex flex-column">
                    <h6 className={`fw-semibold my-0`}>
                      {ledger.amount > 0 ? "+" : ""}
                      {formatNumber(ledger.amount)} {ledger.currency}{" "}
                    </h6>
                    <p className="text-muted">{"N/A"}</p>
                  </div>
                </div>
              ))}
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default ListTransactionss;
