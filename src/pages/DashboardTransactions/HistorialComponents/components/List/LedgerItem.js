import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import {
  CurrencyUSD,
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../utils/utils';

const LedgerItem = ({
  isPreview,
  ledger,
  transaction,
  index,
  isReceived,
  isCopied,
  setIsCopied,
}) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [hasError, setHasError] = useState(false);

  const addressLink = ledger?.contractAddress;

  useEffect(() => {
    // Reset status every time preview state or logo changes
    setShowPlaceholder(false);
    setHasError(false);

    if (isPreview) {
      if (ledger?.txInfo?.logo) {
        setImageSrc(ledger?.txInfo?.logo);
      } else {
        // Show placeholder if no logo in preview
        setImageSrc(null);
        setShowPlaceholder(true);
      }
    } else {
      if (ledger?.txInfo?.logo) {
        setImageSrc(ledger?.txInfo?.logo);
      } else {
        // If no logo and not in preview, show error
        setImageSrc(null);
        setHasError(true);
      }
    }
  }, [ledger, ledger?.txInfo?.logo, isPreview]);

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

  const handleCopyValue = (e, text) => {
    e.stopPropagation();
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const isNft = ledger.isNft;
  const prefix = isReceived ? 'received' : 'sent';
  const targetId = `amount-list-${prefix}-${index}-${transaction.txHash}`;

  return (
    <div
      key={index}
      className="d-flex align-items-center mb-2 w-100 ps-2"
      style={{ minHeight: '50px' }}
    >
      <div className="image-container me-2">
        {showPlaceholder ? (
          <div
            className={
              isNft ? 'skeleton-avatar-square' : 'skeleton-avatar-circle'
            }
          ></div>
        ) : imageSrc && !hasError ? (
          <img
            src={imageSrc}
            alt={ledger?.currency || ledger?.name}
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
            {ledger?.currency || ledger?.name}
          </div>
        )}
      </div>
      <div className="d-flex flex-column justify-content-center">
        <h6 className="fw-semibold my-0">
          {isNft && (ledger.amount === 1 || ledger.amount === -1) ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (addressLink && ledger.txInfo.tokenId) {
                  navigate(
                    `/contract/${addressLink}/?blockchain=${transaction.blockchain}&tokenId=${ledger.txInfo.tokenId}`,
                  );
                }
              }}
              className="text-displayList text-hover-underline text-hover-primary"
            >
              {ledger.currency}
            </span>
          ) : (
            <>
              {ledger.amount > 0 ? '+' : ''}
              <span
                id={targetId}
                onClick={(e) => handleCopyValue(e, ledger.amount)}
              >
                {parseValuesToLocale(ledger.amount, '')}{' '}
                {isNft ? '' : ledger.currency}
              </span>
              <p className="text-start d-flex align-items-center my-0 text-muted">
                {' '}
                {parseValuesToLocale(ledger.nativeamount, CurrencyUSD)}
              </p>

              {ledger.amount && (
                <UncontrolledTooltip
                  placement="bottom"
                  target={targetId}
                  trigger="hover"
                >
                  {isCopied ? 'Copied' : ledger.amount}
                </UncontrolledTooltip>
              )}
            </>
          )}
        </h6>
      </div>
    </div>
  );
};
export default LedgerItem;
