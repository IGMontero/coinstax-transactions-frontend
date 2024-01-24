import React from "react";
import { Col } from "reactstrap";
import { formatNumber, blockchainActions } from "../../../../../utils/utils";
import assetsIcon from "../../../../../assets/images/svg/assets.svg";

const Negativeledgers = ({ negativeLedgers, blockchainAction }) => {
  const currency = negativeLedgers?.currency || "";
  const value = negativeLedgers?.value || 1;
  const hasMoreThanOne = negativeLedgers?.logo === "assets";

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
        {!hasMoreThanOne ? (
          <>
            {!negativeLedgers ? (
              ""
            ) : (
              <>
                <div className="image-container me-2">
                  <img
                    src={negativeLedgers?.logo || currency}
                    alt={negativeLedgers?.displayName}
                    className=""
                    width={35}
                    height={35}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                      const container = e.target.parentNode;
                      const textNode = document.createElement("div");
                      textNode.textContent = currency;
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
                    {negativeLedgers?.displayName}
                  </h6>
                  <p className="text-start my-0">
                    {blockchainAction === blockchainActions.APPROVE
                      ? "Unlimited"
                      : negativeLedgers.price >= 0
                      ? "N/A"
                      : negativeLedgers.price}
                  </p>
                </div>
              </>
            )}
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
              <span className="text-dark">{negativeLedgers.displayName}</span>{" "}
            </div>
          </>
        )}
      </>
    </Col>
  );
};

export default Negativeledgers;
