import React from "react";
import { Col, Row } from "reactstrap";

const ListTransactions = ({ transaction }) => {
  const formatNumber = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "Invalid Number";
    }

    let formattedNumber = parseFloat(number.toFixed(4));
    return formattedNumber.toString();
  };
  return (
    <Col xxl={12} lg={12} className="border-top ">
      <Row className="align-items-start g-0 mt-2">
        <Col xxl={12} className="d-flex mb-2">
          <Col xxl={3} className="ps-2">
            <span>Sent</span>
          </Col>
          <Col xxl={9} className="ps-2">
            <span>Received</span>
          </Col>
        </Col>
        <Col xxl={2} className="d-flex align-items-start flex-column ps-2">
          <div className="d-flex">
            <img src={""} alt="" className="me-2" width={40} height={40} />
            <div className="d-flex flex-column text-start justify-content-start">
              <h6
                className={`fw-semibold my-0 `}
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
          </div>
        </Col>

        <Col
          xxl={1}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="d-flex flex-column align-items-center">
            <div className="bg-dark" style={{ width: 1.0, height: 50 }} />
            <div
              style={{
                marginTop: "-12px",
                marginBottom: "-12px",
              }}
            >
              <i className="ri-arrow-right-circle-line text-success fs-1 mb-0 mt-0"></i>
            </div>
            <div className="bg-dark" style={{ width: 1.0, height: 60 }} />
          </div>
        </Col>
        <Col
          xxl={9}
          className="d-flex align-items-center flex-column justify-content-center"
        >
          <>
            {transaction.ledgers &&
              transaction.ledgers.map((ledger, index) => {
                if (index === 0 || index === transaction.ledgers.length - 1)
                  return null;

                return (
                  <div
                    key={index}
                    className="d-flex align-items-center w-100 ps-2"
                  >
                    <img
                      src={ledger.txInfo.logo}
                      alt=""
                      className="me-2 rounded mb-3"
                      width={40}
                      height={40}
                    />
                    <h6 className={`fw-semibold my-0`}>
                      {formatNumber(ledger.amount)} {ledger.currency}
                    </h6>
                  </div>
                );
              })}
          </>
        </Col>
      </Row>
    </Col>
  );
};

export default ListTransactions;
