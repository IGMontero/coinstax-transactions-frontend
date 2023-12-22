import React from "react";
import { Col } from "reactstrap";
import { formatNumber } from "../../../../../utils/utils";

const AllLedgers = ({ ledger, index }) => {
  return (
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
              ? `+${formatNumber(ledger.amount)} ${ledger.currency}`
              : `${formatNumber(ledger.amount)} ${ledger.currency}`}
          </h6>
          <p className="text-start my-0">
            {ledger.price >= 0 ? "N/A" : ledger.price}
          </p>
        </div>
      </>
    </Col>
  );
};

export default AllLedgers;
