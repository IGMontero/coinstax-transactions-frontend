import React from "react";
import { formatNumber } from "../../../../../utils/utils";
import assetsIcon from "../../../../../assets/images/svg/assets.svg";

const PositiveLedgers = ({ positiveLedgers }) => {
  return (
    <>
      {positiveLedgers.length > 0 && (
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
                    +{formatNumber(positiveLedgers[0].amount)}{" "}
                    {positiveLedgers[0].currency}
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
      )}
    </>
  );
};

export default PositiveLedgers;
