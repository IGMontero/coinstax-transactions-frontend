import React from "react";
import { UncontrolledPopover, PopoverBody } from "reactstrap";
import { formatNumber } from "../../../../../utils/utils";
import assetsIcon from "../../../../../assets/images/svg/assets.svg";

const PositiveLedgers = ({ positiveLedgers, negativeLedgers }) => {
  const currency = positiveLedgers?.currency || "";
  const value = positiveLedgers?.value || 0;

  const hasMoreThanOne =
    positiveLedgers?.logo === "assets" ||
    positiveLedgers?.logo === "+4 .crypto";

  return (
    <>
      <div className="d-flex align-items-center">
        <i className="ri-arrow-right-line text-dark text-end fs-4 me-3"></i>
        <h6 className="fw-semibold my-0 d-flex align-items-center justify-content-center">
          {!hasMoreThanOne ? (
            <>
              <div className="image-container">
                <img
                  src={positiveLedgers?.logo || currency}
                  alt={positiveLedgers?.displayName}
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
              <div className="d-flex flex-column">
                <span className="text-success d-flex ms-2">
                  <span id={`positive-ledger-${value}`} className="me-1">
                    {positiveLedgers?.displayName}
                  </span>
                </span>

                <p className="text-start my-0 text-muted">
                  {positiveLedgers
                    ? positiveLedgers.price >= 0
                      ? "N/A"
                      : positiveLedgers.price
                    : ""}
                </p>
              </div>
              {/* <UncontrolledPopover
                  onClick={(e) => e.stopPropagation()}
                  placement="bottom"
                  target={`positive-ledger-${positiveLedgers.amount}`}
                  trigger="hover"
                >
                  <PopoverBody className="p-1">
                    {positiveLedgers[0].amount}
                  </PopoverBody>
                </UncontrolledPopover> */}
            </>
          ) : (
            <>
              <div className="bg-primary rounded-circle align-items-center justify-content-center d-flex ">
                <img
                  src={assetsIcon}
                  alt=""
                  className="p-1 "
                  width={35}
                  height={35}
                />
              </div>
              <div className="ms-2 ">
                <span className="text-success">
                  {positiveLedgers.displayName}
                </span>
                <p className="text-start my-0 text-muted">
                  {positiveLedgers
                    ? positiveLedgers.price >= 0
                      ? "N/A"
                      : positiveLedgers.price
                    : ""}
                </p>
              </div>
            </>
          )}
        </h6>
      </div>
    </>
  );
};

export default PositiveLedgers;
