import React, { useEffect, useState } from 'react';
import {
  Col,
  PopoverBody,
  UncontrolledPopover,
  UncontrolledTooltip,
} from 'reactstrap';
import assetsIcon from '../../../../../assets/images/svg/assets.svg';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyUSD,
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../utils/utils';
import { composeTransactionNftUrl } from '../../utils/transactionUtils';

const SentColumn = ({ transaction }) => {
  const navigate = useNavigate();
  const negativeLedgers = transaction.txSummary.sent;

  const currency = negativeLedgers?.currency || '';
  const hasMoreThanOne = negativeLedgers?.logo === 'assets';

  const [isCopied, setIsCopied] = React.useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sentNftInfo = transaction?.txSummary?.sent?.nftInfo;

  const nftTokenId = sentNftInfo?.tokenId;
  const nftContractAddress = sentNftInfo?.contractAddress;

  const handleCopyValue = (e) => {
    e.stopPropagation();
    // navigator?.clipboard?.writeText(negativeLedgers.value);
    copyToClipboard(negativeLedgers.value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const isPreview = transaction?.preview;
  // This useEffect is used to set the image source and show the placeholder if the image is not available
  useEffect(() => {
    // Reset status every time preview state or logo changes
    setShowPlaceholder(false);
    setHasError(false);

    if (isPreview) {
      if (negativeLedgers?.logo) {
        setImageSrc(negativeLedgers.logo);
      } else {
        // Show placeholder if no logo in preview
        setImageSrc(null);
        setShowPlaceholder(true);
      }
    } else {
      if (negativeLedgers?.logo) {
        setImageSrc(negativeLedgers.logo);
      } else {
        // If no logo and not in preview, show error
        setImageSrc(null);
        setHasError(true);
      }
    }
  }, [negativeLedgers?.logo, isPreview]);

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

  const parsedValue = parseValuesToLocale(negativeLedgers?.value, '');

  const isNft = negativeLedgers?.isNft;

  const hasAssetsCount = transaction.txSummary?.sentAssetsCount >= 2;
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
                <div className="image-container">
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
                      alt={negativeLedgers?.currency || negativeLedgers?.name}
                      className="rounded img-transaction"
                      width="auto"
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
                      {negativeLedgers?.currency || negativeLedgers?.name}
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
                        id={`amount-left-${transaction?.txHash}`}
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
                          if (nftContractAddress && nftTokenId) {
                            navigate(
                              composeTransactionNftUrl({
                                contractAddress: nftContractAddress,
                                blockchain: transaction.blockchain,
                                tokenId: nftTokenId,
                              }),
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
                      document.getElementById(
                        `amount-left-${transaction.txHash}`,
                      ) ? (
                      <UncontrolledTooltip
                        placement="bottom"
                        target={`amount-left-${transaction.txHash}`}
                        trigger="hover"
                      >
                        {isCopied ? 'Copied' : negativeLedgers?.value}
                      </UncontrolledTooltip>
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
                        <>{null}</>
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
            <div className="ms-3 ">
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
