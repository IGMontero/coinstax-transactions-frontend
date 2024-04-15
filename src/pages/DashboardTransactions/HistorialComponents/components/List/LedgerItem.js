import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import {
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../utils/utils';

const LedgerItem = ({
  isPreview,
  ledger,
  index,
  isReceived,
  isCopied,
  setIsCopied,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (ledger.txInfo?.logo) {
      setImageSrc(ledger.txInfo?.logo);
      setShowPlaceholder(false);
    } else if (isPreview) {
      setShowPlaceholder(true);
    } else {
      setShowPlaceholder(false);
      setImageSrc(null);
    }
  }, [ledger, ledger.txInfo?.logo, isPreview]);

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
  const targetId = `amount-list-${prefix}-${index}-${ledger.txHash}`;

  return (
    <div
      key={index}
      className="d-flex align-items-center mb-2 w-100 ps-2"
      style={{ minHeight: '50px' }}
    >
      <div className="image-container me-2 d-flex align-items-center justify-content-center">
        {showPlaceholder ? (
          <div
            className={
              isNft ? 'skeleton-avatar-square' : 'skeleton-avatar-circle'
            }
          ></div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={ledger.currency}
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
            {ledger?.currency}
          </div>
        )}
      </div>
      <div className="d-flex flex-column justify-content-center">
        <h6 className="fw-semibold my-0">
          {isNft && (ledger.amount === 1 || ledger.amount === -1) ? (
            <span
              onClick={() =>
                navigate(
                  `/contract/${ledger.txInfo.contractAddressInfo.address}/?tokenId=${ledger.txInfo.tokenId}`,
                )
              }
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
              {ledger.amount && (
                <UncontrolledPopover
                  onClick={(e) => e.stopPropagation()}
                  placement="bottom"
                  target={targetId}
                  trigger="hover"
                >
                  <PopoverBody
                    style={{ width: 'auto' }}
                    className="text-center w-auto p-2 "
                  >
                    <span style={{ fontSize: '0.70rem' }}>
                      {isCopied ? 'Copied' : ledger.amount}
                    </span>
                  </PopoverBody>
                </UncontrolledPopover>
              )}
            </>
          )}
        </h6>
      </div>
    </div>
  );
};
export default LedgerItem;
