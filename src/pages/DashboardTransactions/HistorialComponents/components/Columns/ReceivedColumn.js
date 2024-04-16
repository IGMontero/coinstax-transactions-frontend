import React, { useEffect, useState } from 'react';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import {
  PopoverBody,
  UncontrolledPopover,
  UncontrolledTooltip,
} from 'reactstrap';
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
  const [hasError, setHasError] = useState(false);

  const parseValue = parseValuesToLocale(positiveLedgers?.value, '');

  const isNft = positiveLedgers?.isNft;

  const hasAssetsCount = ledger.txSummary?.receivedAssetsCount >= 2;

  const isPreview = ledger?.preview;

  useEffect(() => {
    // Reset status every time preview state or logo changes
    setShowPlaceholder(false);
    setHasError(false);

    if (isPreview) {
      if (positiveLedgers?.logo) {
        setImageSrc(positiveLedgers.logo);
      } else {
        // Show placeholder if no logo in preview
        setImageSrc(null);
        setShowPlaceholder(true);
      }
    } else {
      if (positiveLedgers?.logo) {
        setImageSrc(positiveLedgers.logo);
      } else {
        // If no logo and not in preview, show error
        setImageSrc(null);
        setHasError(true);
      }
    }
  }, [ledger, positiveLedgers?.logo, isPreview]);

  const handleImageError = () => {
    // If there is an error and we are in preview, show placeholder
    if (isPreview) {
      setShowPlaceholder(true);
      setImageSrc(null);
    } else {
      // If there is an error and we are not in preview, show error
      setShowPlaceholder(false);
      setHasError(true);
    }
  };

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

  // const renderPophover = ({ ledger, positiveLedgers, isCopied }) => {
  //   return (
  //     <UncontrolledPopover
  //       onClick={(e) => e.stopPropagation()}
  //       placement="bottom"
  //       target={`amount-${ledger.txHash}`}
  //       trigger="hover"
  //     >
  //       <PopoverBody
  //         style={{
  //           width: 'auto',
  //         }}
  //         className="text-center w-auto p-2 "
  //       >
  //         <span
  //           style={{
  //             fontSize: '0.70rem',
  //           }}
  //         >
  //           {isCopied ? 'Copied' : positiveLedgers?.value}
  //         </span>
  //       </PopoverBody>
  //     </UncontrolledPopover>
  //   );
  // };

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
                <div className="image-container me-1">
                  {showPlaceholder ? (
                    <div
                      className={
                        isNft
                          ? 'skeleton-avatar-square'
                          : 'skeleton-avatar-circle'
                      }
                    ></div>
                  ) : imageSrc && !hasError ? (
                    <img
                      src={imageSrc}
                      alt={positiveLedgers?.currency || positiveLedgers?.name}
                      className="rounded"
                      width={35}
                      height={35}
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className={
                        isNft
                          ? 'skeleton-avatar-square-error'
                          : 'skeleton-avatar-circle-error'
                      }
                    >
                      {positiveLedgers?.currency || positiveLedgers?.name}
                    </div>
                  )}
                </div>
                <div className="d-flex flex-column">
                  <span
                    className={`d-flex ${hasAssetsCount ? 'text-dark' : `text-${isNft ? 'hover-primary text-hover-underline' : 'success'}`}`}
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
                      <UncontrolledTooltip
                        placement="bottom"
                        target={`amount-${ledger.txHash}`}
                        trigger="hover"
                      >
                        {isCopied ? 'Copied' : positiveLedgers?.value}
                      </UncontrolledTooltip>
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
                        ? null
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
