import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';

const Negativeledgers = ({ ledger }) => {
  const negativeLedgers = ledger.txSummary.sent;
  const currency = negativeLedgers?.currency || '';
  const hasMoreThanOne = negativeLedgers?.logo === 'assets';

  return (
    <div className="d-flex align-items-center" style={{ overflow: 'hidden' }}>
      <>
        {!hasMoreThanOne ? (
          <>
            {!negativeLedgers ? (
              ''
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
                      e.target.style.display = 'none';
                      const container = e.target.parentNode;
                      const textNode = document.createElement('div');
                      textNode.textContent = currency;
                      textNode.className = 'currency-placeholder';
                      container.appendChild(textNode);
                    }}
                  />{' '}
                </div>
                <div className="d-flex flex-column text-center justify-content-end ms-2">
                  <span className="text-dark d-flex">
                    <span
                      id={`amount-left-${ledger.txHash}`}
                      className="me-1"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {negativeLedgers?.displayName}
                    </span>
                    {negativeLedgers?.value !== -1 && (
                      <UncontrolledPopover
                        onClick={(e) => e.stopPropagation()}
                        placement="bottom"
                        target={`amount-left-${ledger.txHash}`}
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
                            {negativeLedgers.value}
                          </span>
                        </PopoverBody>
                      </UncontrolledPopover>
                    )}
                  </span>
                  <p className="text-start my-0">
                    {negativeLedgers && negativeLedgers.prettyNativeAmount ? (
                      <p className="text-star d-flex align-items-center my-0 text-muted ">
                        {negativeLedgers.prettyNativeAmount}
                      </p>
                    ) : (
                      <>
                        <p className="text-start d-flex fs-6 align-items-center my-0 text-muted ">
                          N/A
                          <i
                            id={`nativeAmmount-id-${ledger.txHash}`}
                            class="ri-information-line ms-1 fs-6 text-muted"
                          ></i>
                          <UncontrolledPopover
                            onClick={(e) => e.stopPropagation()}
                            placement="bottom"
                            target={`nativeAmmount-id-${ledger.txHash}`}
                            trigger="hover"
                          >
                            <PopoverBody
                              style={{
                                width: 'auto',
                              }}
                              className="w-auto p-2 text-center "
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
                    )}
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
              <span className="text-dark">{negativeLedgers.displayName}</span>{' '}
              <p className="text-start my-0 text-muted">
                {negativeLedgers.prettyNativeAmount || ''}
              </p>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default Negativeledgers;
