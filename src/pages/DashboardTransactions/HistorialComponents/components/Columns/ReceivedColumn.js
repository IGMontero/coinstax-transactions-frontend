import React, { useEffect, useState } from 'react';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import {
  CurrencyUSD,
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../utils/utils';

import { useNavigate } from 'react-router-dom';

const ReceivedColumn = ({ ledger, negativeLedgers }) => {
  const positiveLedgers = ledger.txSummary.received;
  const navigate = useNavigate();

  const addressLink = negativeLedgers?.nftInfo?.contractAddress;

  const tokenId = positiveLedgers?.nftInfo?.tokenId || undefined;

  const currency = positiveLedgers?.currency || '';

  const hasMoreThanOne = positiveLedgers?.logo === 'assets';

  const [isCopied, setIsCopied] = React.useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const parseValue = parseValuesToLocale(positiveLedgers?.value, '');

  const isNft = positiveLedgers?.isNft;

  const hasAssetsCount = ledger.txSummary?.receivedAssetsCount >= 2;

  const isPreview = ledger?.preview;

  useEffect(() => {
    if (positiveLedgers?.logo) {
      setImageSrc(positiveLedgers.logo);
      setShowPlaceholder(false);
    } else if (isPreview) {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
      setImageSrc(null);
    }
  }, [ledger, positiveLedgers?.logo, isPreview]);

  const handleCopyValue = (e, value) => {
    if (value) {
      e.stopPropagation();
      copyToClipboard(value);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
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
                  {showPlaceholder ? (
                    <div
                      className={
                        isNft
                          ? 'skeleton-avatar-square'
                          : 'skeleton-avatar-circle'
                      }
                    ></div>
                  ) : imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={
                        positiveLedgers?.displayName ||
                        positiveLedgers?.currency
                      }
                      className="rounded"
                      width={35}
                      height={35}
                      onError={() => {
                        setShowPlaceholder(true);
                      }}
                    />
                  ) : (
                    <div
                      className={
                        isNft
                          ? 'skeleton-avatar-square-error'
                          : 'skeleton-avatar-circle-error'
                      }
                    >
                      {positiveLedgers?.currency}
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column">
                  <span
                    className={`d-flex ${hasAssetsCount ? 'text-white' : `text-${isNft ? 'hover-primary text-hover-underline' : 'success'}`}`}
                  >
                    <span
                      onClick={(e) => {
                        if (hasAssetsCount) return;
                        if (isNft) {
                          e.stopPropagation();
                          if (addressLink && tokenId) {
                            navigate(
                              `/contract/${addressLink}?tokenId=${tokenId}`,
                            );
                          }
                        } else {
                          handleCopyValue(e, positiveLedgers?.value);
                        }
                      }}
                      id={`amount-${ledger.txHash}`}
                      className={`me-1 ${!negativeLedgers ? '' : 'text-displayName'} `}
                    >
                      {!isNft
                        ? `+${parseValue} ${currency}`
                        : `${positiveLedgers?.displayName}`}
                    </span>
                    {positiveLedgers?.value &&
                    !isNft &&
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
                  !positiveLedgers.hideNativeAmount &&
                  positiveLedgers.nativeAmount ? (
                    <p className="text-start d-flex align-items-center my-0 text-muted">
                      {parseValuesToLocale(
                        positiveLedgers?.nativeAmount,
                        CurrencyUSD,
                      )}
                    </p>
                  ) : (
                    <>
                      {ledger &&
                      ledger.txHash &&
                      !positiveLedgers.hideNativeAmount
                        ? // <p className="text-start d-flex fs-6 align-items-center my-0 text-muted">
                          //   N/A
                          //   <i
                          //     id={`nativeAmount-${ledger.txHash}`}
                          //     className="ri-information-line ms-1 fs-6 text-muted"
                          //   ></i>
                          //   <UncontrolledPopover
                          //     onClick={(e) => e.stopPropagation()}
                          //     placement="bottom"
                          //     target={`nativeAmount-${ledger.txHash}`}
                          //     trigger="hover"
                          //   >
                          //     <PopoverBody
                          //       style={{
                          //         width: 'auto',
                          //       }}
                          //       className="w-auto p-2 text-center"
                          //     >
                          //       <span
                          //         style={{
                          //           fontSize: '0.70rem',
                          //         }}
                          //       >
                          //         The price is not available at the time of the
                          //         transaction
                          //       </span>
                          //     </PopoverBody>
                          //   </UncontrolledPopover>
                          // </p>
                          null
                        : null}
                    </>
                  )}
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
                  {positiveLedgers?.nativeAmount === 0
                    ? ''
                    : parseValuesToLocale(
                        positiveLedgers?.nativeAmount,
                        CurrencyUSD,
                      )}
                </p>
              </div>
            </div>
          </>
        )}
      </h6>
    </div>
  );
};

export default ReceivedColumn;
