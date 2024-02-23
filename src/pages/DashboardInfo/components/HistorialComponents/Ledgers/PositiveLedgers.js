import React from 'react';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

const PositiveLedgers = ({ ledger, negativeLedgers }) => {
  const positiveLedgers = ledger.txSummary.received;

  const currency = positiveLedgers?.currency || '';

  const hasMoreThanOne = positiveLedgers?.logo === 'assets';

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyValue = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(positiveLedgers?.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-start"
      style={{ overflow: 'hidden' }}
    >
      <h6
        className={`fw-semibold my-0  d-flex align-items-center justify-content-start`}
      >
        {!hasMoreThanOne ? (
          <>
            {!positiveLedgers ? (
              ''
            ) : (
              <>
                {!negativeLedgers ? null : (
                  <i className="ri-arrow-right-line text-dark text-end fs-4 me-2"></i>
                )}
                <div
                  className={`image-container me-2 ${
                    negativeLedgers ? '' : ''
                  }`}
                >
                  <img
                    src={positiveLedgers?.logo || currency}
                    alt={positiveLedgers?.displayName}
                    className="ps-0 rounded"
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
                    <span
                      onClick={handleCopyValue}
                      id={`amount-${ledger.txHash}`}
                      className={`me-1 ${!negativeLedgers ? '' : 'text-displayName'} `}
                    >
                      {positiveLedgers?.displayName}
                    </span>
                    {positiveLedgers?.value &&
                    !positiveLedgers.marketplaceName ? (
                      <UncontrolledPopover
                        onClick={(e) => e.stopPropagation()}
                        placement="bottom"
                        target={`amount-${ledger.txHash}`}
                        trigger="hover"
                      >
                        <PopoverBody
                          style={{
                            width: 'auto',
                          }}
                          className="text-center w-auto p-2 "
                        >
                          <span
                            style={{
                              fontSize: '0.70rem',
                            }}
                          >
                            {isCopied ? 'Copied' : positiveLedgers?.value}
                          </span>
                        </PopoverBody>
                      </UncontrolledPopover>
                    ) : null}
                  </span>

                  {positiveLedgers &&
                    positiveLedgers.hideNativeAmount !== true &&
                    (positiveLedgers.prettyNativeAmount ? (
                      <p className="text-start d-flex align-items-center my-0 text-muted">
                        {positiveLedgers.prettyNativeAmount}
                      </p>
                    ) : (
                      <>
                        <p className="text-start d-flex fs-6 align-items-center my-0 text-muted">
                          N/A
                          <i
                            id={`nativeAmount-${ledger.txHash}`}
                            className="ri-information-line ms-1 fs-6 text-muted"
                          ></i>
                          <UncontrolledPopover
                            onClick={(e) => e.stopPropagation()}
                            placement="bottom"
                            target={`nativeAmount-${ledger.txHash}`}
                            trigger="hover"
                          >
                            <PopoverBody
                              style={{
                                width: 'auto',
                              }}
                              className="w-auto p-2 text-center"
                            >
                              <span
                                style={{
                                  fontSize: '0.70rem',
                                }}
                              >
                                The price is not available at the time of the
                                transaction
                              </span>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </p>
                      </>
                    ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center text-start align-items-center ">
              <i className="ri-arrow-right-line text-dark text-start fs-4 me-2"></i>
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
                  {positiveLedgers.prettyNativeAmount || ''}
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
