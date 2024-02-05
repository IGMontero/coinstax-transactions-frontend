import React from 'react';

import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import { blockchainActions } from '../../../../../utils/utils';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

const PositiveLedgers = ({
  positiveLedgers,
  negativeLedgers,
  ledgerFee,
  blockchainAction,
}) => {
  const currency = positiveLedgers?.currency || '';
  const value = positiveLedgers?.value || 0;

  const hasMoreThanOne = positiveLedgers?.logo === 'assets';

  console.log(positiveLedgers);

  return (
    <div className="d-flex align-items-center justify-content-start">
      <h6
        className={`fw-semibold my-0  d-flex align-items-center justify-content-start`}
        // className="fw-semibold my-0 ms-n3 d-flex align-items-center justify-content-start">
      >
        {!hasMoreThanOne ? (
          <>
            {!positiveLedgers ? (
              ''
            ) : (
              <>
                {!negativeLedgers ? null : (
                  <i className="ri-arrow-right-line text-dark text-end fs-4 me-3"></i>
                )}
                <div
                  className={`image-container me-2 ${
                    negativeLedgers ? '' : ''
                  }`}
                >
                  <img
                    src={positiveLedgers?.logo || currency}
                    alt={positiveLedgers?.displayName}
                    className="ps-0"
                    width={35}
                    height={35}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const container = e.target.parentNode;
                      const textNode = document.createElement('div');
                      textNode.textContent = currency;
                      textNode.className = 'currency-placeholder';
                      container.appendChild(textNode);
                    }}
                  />{' '}
                </div>
                <div className="d-flex flex-column">
                  <span className="text-success d-flex">
                    <span id={`positive-ledger-${value}`} className="me-1">
                      {positiveLedgers?.displayName}
                    </span>
                  </span>

                  <>
                    <p className="text-star d-flex align-items-center my-0 text-muted ">
                      N/A
                      <i
                        id={`nativeAmmount-id-${positiveLedgers.blockHash}`}
                        class="ri-information-line ms-2  fs-4 text-muted"
                      ></i>
                      <UncontrolledPopover
                        onClick={(e) => e.stopPropagation()}
                        placement="bottom"
                        target={`nativeAmmount-id-${positiveLedgers.blockHash}`}
                        trigger="hover"
                      >
                        <PopoverBody>
                          <span className="fs-8">
                            The price is not available at the time of the
                            transaction
                          </span>
                        </PopoverBody>
                      </UncontrolledPopover>
                    </p>
                  </>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center text-start align-items-center ">
              <i className="ri-arrow-right-line text-dark text-start fs-4 me-3"></i>
              <div className="bg-primary  rounded-circle align-items-center justify-content-center d-flex ">
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
                      ? 'N/A'
                      : positiveLedgers.price
                    : ''}
                </p>
              </div>
            </div>
          </>
        )}
      </h6>
    </div>
  );
};

export default PositiveLedgers;
