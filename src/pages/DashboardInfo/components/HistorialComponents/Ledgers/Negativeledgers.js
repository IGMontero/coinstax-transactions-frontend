import React from "react";
import { Col } from "reactstrap";
import { formatNumber, blockchainActions } from "../../../../../utils/utils";

const Negativeledgers = ({ negativeLedgers }) => {
  return (
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
            <div className="image-container">
              <img
                src={
                  negativeLedgers[0].txInfo?.logo || negativeLedgers[0].currency
                }
                alt={negativeLedgers[0].txInfo?.name}
                className="me-2"
                width={35}
                height={35}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  const container = e.target.parentNode;
                  const textNode = document.createElement("div");
                  textNode.textContent = negativeLedgers[0].currency;
                  textNode.className = "currency-placeholder";
                  container.appendChild(textNode);
                }}
              />{" "}
            </div>
            <div className="d-flex flex-column text-center justify-content-end ms-2">
              <h6
                className="fw-semibold my-0 text-dark"
                style={{ whiteSpace: "nowrap" }}
              >
                {formatNumber(negativeLedgers[0].amount)}{" "}
                {negativeLedgers[0].currency}
              </h6>
              <p className="text-start my-0">
                {negativeLedgers.blockchainAction === blockchainActions.APPROVE
                  ? "Unlimited"
                  : negativeLedgers.price >= 0
                  ? "N/A"
                  : negativeLedgers.price}
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
            <div className="ms-2 ">{negativeLedgers.length} Assets</div>
          </>
        )}
      </>
    </Col>
  );
};

export default Negativeledgers;
