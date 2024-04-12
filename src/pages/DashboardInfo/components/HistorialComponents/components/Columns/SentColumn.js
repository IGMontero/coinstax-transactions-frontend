import React, { useEffect, useState } from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import assetsIcon from '../../../../../../assets/images/svg/assets.svg';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyUSD,
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../../utils/utils';

const SentColumn = ({ ledger }) => {
  const navigate = useNavigate();
  const negativeLedgers = ledger.txSummary.sent;
  const addressLink = negativeLedgers?.nftInfo?.contractAddress;

  const currency = negativeLedgers?.currency || '';
  const hasMoreThanOne = negativeLedgers?.logo === 'assets';

  const [isCopied, setIsCopied] = React.useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handleCopyValue = (e) => {
    e.stopPropagation();
    // navigator?.clipboard?.writeText(negativeLedgers.value);
    copyToClipboard(negativeLedgers.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const isPreview = ledger?.preview;
  // This useEffect is used to set the image source and show the placeholder if the image is not available
  useEffect(() => {
    if (negativeLedgers?.logo) {
      setImageSrc(negativeLedgers.logo);
      setShowPlaceholder(false);
    } else if (isPreview) {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
      setImageSrc(null);
    }
  }, [ledger, negativeLedgers?.logo, isPreview]);

  const parsedValue = parseValuesToLocale(negativeLedgers?.value, '');

  const isNft = negativeLedgers?.isNft;

  const hasAssetsCount = ledger.txSummary?.sentAssetsCount >= 2;
  const tokenId = negativeLedgers?.nftInfo?.tokenId || undefined;

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
                        negativeLedgers?.displayName ||
                        negativeLedgers?.currency
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
                      {negativeLedgers?.currency}
                    </div>
                  )}
                </div>

                <div className="d-flex flex-column text-center justify-content-end ms-2">
                  <span className="text-dark d-flex">
                    {!isNft &&
                    negativeLedgers?.value !== 0 &&
                    !hasAssetsCount ? (
                      <span
                        onClick={handleCopyValue}
                        id={`amount-left-${ledger?.txHash}`}
                        className="text-displayName"
                      >
                        {isNft
                          ? negativeLedgers?.displayName
                          : `${parsedValue} ${currency}`}
                      </span>
                    ) : hasAssetsCount ? (
                      <span className="text-displayName">
                        {isNft
                          ? negativeLedgers?.displayName
                          : `${parsedValue} ${currency}`}
                      </span>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (addressLink && tokenId) {
                            navigate(
                              `/contract/${addressLink}?tokenId=${tokenId}`,
                            );
                          }
                        }}
                        className="text-displayName text-hover-underline text-hover-primary"
                      >
                        {isNft
                          ? negativeLedgers?.displayName
                          : `${parsedValue} ${currency}`}
                      </span>
                    )}

                    {negativeLedgers?.value !== -1 &&
                    negativeLedgers?.value !== 0 &&
                    document.getElementById(`amount-left-${ledger.txHash}`) ? (
                      <UncontrolledPopover
                        onClick={(e) => e.stopPropagation()}
                        placement="bottom"
                        target={`amount-left-${ledger?.txHash}`}
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
                      (negativeLedgers.nativeAmount ? (
                        <p className="text-start d-flex align-items-center my-0 text-muted">
                          {parseValuesToLocale(
                            negativeLedgers.nativeAmount,
                            CurrencyUSD,
                          )}
                        </p>
                      ) : (
                        <>
                          {/* <p className="text-start d-flex fs-6 align-items-center my-0 text-muted">
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
                          </p> */}
                          {null}
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
                {negativeLedgers?.nativeAmount === 0
                  ? ''
                  : parseValuesToLocale(
                      negativeLedgers?.nativeAmount,
                      CurrencyUSD,
                    )}
              </p>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default SentColumn;
