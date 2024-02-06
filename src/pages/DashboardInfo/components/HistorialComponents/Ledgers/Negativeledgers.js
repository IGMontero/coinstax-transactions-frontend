import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';

const Negativeledgers = ({ negativeLedgers }) => {
  const currency = negativeLedgers?.currency || '';
  const value = negativeLedgers?.value || 1;
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
                  <h6
                    className="fw-semibold my-0 text-dark"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {negativeLedgers?.displayName}
                  </h6>
                  <p className="text-start my-0">
                    {negativeLedgers && negativeLedgers.prettyNativeAmount ? (
                      <p className="text-star d-flex align-items-center my-0 text-muted ">
                        {negativeLedgers.prettyNativeAmount}
                      </p>
                    ) : (
                      <>
                        <p className="text-star d-flex align-items-center my-0 text-muted ">
                          N/A
                          <i
                            id={`nativeAmmount-id-${negativeLedgers.blockHash}`}
                            class="ri-information-line ms-2  fs-4 text-muted"
                          ></i>
                          <UncontrolledPopover
                            onClick={(e) => e.stopPropagation()}
                            placement="bottom"
                            target={`nativeAmmount-id-${negativeLedgers.blockHash}`}
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
