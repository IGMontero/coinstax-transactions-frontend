import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '../../../../../utils/utils';
import Swal from 'sweetalert2';

const Negativeledgers = ({ ledger }) => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const address = queryParams.get('address');

  const randomNumber = Math.floor(Math.random() * 100) + 1;

  const negativeLedgers = ledger.txSummary.sent;
  const addressLink =
    ledger.txSummary.mainContractAddressInfo?.address ||
    ledger.txSummary.mainContractAddress;

  const currency = negativeLedgers?.currency || '';
  const hasMoreThanOne = negativeLedgers?.logo === 'assets';

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyValue = (e) => {
    e.stopPropagation();
    // navigator?.clipboard?.writeText(negativeLedgers.value);
    copyToClipboard(negativeLedgers.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const isNft = negativeLedgers?.isNft;

  const hasAssetsCount = ledger.txSummary?.sentAssetsCount >= 2;

  const tokenId = null;
  return (
    <div className="d-flex align-items-center" style={{ overflow: 'hidden' }}>
      <>
        {!hasMoreThanOne ? (
          <>
            {!negativeLedgers ? (
              ''
            ) : (
              <>
                <div className="image-container me-1">
                  <img
                    src={negativeLedgers?.logo || currency}
                    alt={negativeLedgers?.displayName}
                    className="rounded"
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
                    {!isNft &&
                    negativeLedgers?.value !== 0 &&
                    !hasAssetsCount ? (
                      <span
                        onClick={handleCopyValue}
                        id={`amount-left-${ledger.txHash}`}
                        className="text-displayName"
                      >
                        {negativeLedgers?.displayName}
                      </span>
                    ) : hasAssetsCount ? (
                      <span className="text-displayName">
                        {negativeLedgers?.displayName}
                      </span>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (addressLink && tokenId) {
                            navigate(
                              `/contract/${addressLink}/?tokenId=${tokenId}`,
                            );
                          }
                        }}
                        className="text-displayName text-hover-underline text-hover-primary"
                      >
                        {negativeLedgers?.displayName}
                      </span>
                    )}

                    {negativeLedgers?.value !== -1 &&
                    negativeLedgers?.value !== 0 ? (
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
                            {isCopied ? 'Copied' : negativeLedgers?.value}
                          </span>
                        </PopoverBody>
                      </UncontrolledPopover>
                    ) : null}
                  </span>
                  <p className="text-start my-0">
                    {negativeLedgers &&
                      negativeLedgers.hideNativeAmount !== true &&
                      (negativeLedgers.prettyNativeAmount ? (
                        <p className="text-start d-flex align-items-center my-0 text-muted">
                          {negativeLedgers.prettyNativeAmount}
                        </p>
                      ) : (
                        <>
                          <p className="text-start d-flex fs-6 align-items-center my-0 text-muted">
                            N/A
                            <i
                              id={`nativeAmount-id-${ledger.txHash}`}
                              className="ri-information-line ms-1 fs-6 text-muted"
                            ></i>
                            <UncontrolledPopover
                              onClick={(e) => e.stopPropagation()}
                              placement="bottom"
                              target={`nativeAmount-id-${ledger.txHash}`}
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
