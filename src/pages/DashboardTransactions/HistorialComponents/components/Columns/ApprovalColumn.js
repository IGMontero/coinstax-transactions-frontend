import React, { useEffect } from 'react';
import {
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../utils/utils';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

const ApprovalColumn = ({ transaction }) => {
  const transactionApproval = transaction?.txSummary?.approval;

  const isPreview = transaction?.preview;

  const [isCopied, setIsCopied] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [showPlaceholder, setShowPlaceholder] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const parsedValue = parseValuesToLocale(transactionApproval?.value, '');

  useEffect(() => {
    // Reset status every time preview state or logo changes
    setShowPlaceholder(false);
    setHasError(false);

    if (isPreview) {
      if (transactionApproval.logo) {
        setImageSrc(transactionApproval.logo);
      } else {
        // Show placeholder if no logo in preview
        setImageSrc(null);
        setShowPlaceholder(true);
      }
    } else {
      if (transactionApproval?.logo) {
        setImageSrc(transactionApproval.logo);
      } else {
        // If no logo and not in preview, show error
        setImageSrc(null);
        setHasError(true);
      }
    }
  }, [transaction, transactionApproval?.logo, isPreview]);

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

  return (
    <div
      className="d-flex align-items-center justify-content-start"
      style={{ overflow: 'hidden' }}
    >
      <>
        <div className="image-container me-2">
          {showPlaceholder ? (
            <div className="skeleton-avatar-circle"></div>
          ) : imageSrc && !hasError ? (
            <img
              src={imageSrc}
              alt={transactionApproval?.currency || transactionApproval?.name}
              className="rounded"
              width={35}
              height={35}
              onError={handleImageError}
            />
          ) : (
            <div className="skeleton-avatar-circle-error">
              {transactionApproval?.currency || transactionApproval?.name}
            </div>
          )}
        </div>
        <h6
          className={`fw-semibold my-0  d-flex align-items-center justify-content-start`}
        >
          <div className="d-flex flex-column">
            <span className={`d-flex text-white'`}>
              <span
                onClick={(e) => {
                  handleCopyValue(e, transactionApproval?.value);
                }}
                id={`amount-${transaction.txHash}`}
                className={`me-1 text-displayName `}
              >
                <>
                  {transactionApproval?.name}
                  {/* {transactionApproval?.name !==
                    transactionApproval?.currency &&
                    ` ${transactionApproval?.currency}`} */}
                </>
              </span>
              {transactionApproval?.value ? (
                <UncontrolledPopover
                  onClick={(e) => e.stopPropagation()}
                  placement="bottom"
                  target={`amount-${transaction.txHash}`}
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
                      {isCopied ? 'Copied' : transactionApproval?.value}
                    </span>
                  </PopoverBody>
                </UncontrolledPopover>
              ) : null}
            </span>
            <p className="text-start d-flex align-items-center my-0 text-muted">
              {parsedValue} {transactionApproval?.currency}
            </p>
          </div>
        </h6>
      </>
    </div>
  );
};
export default ApprovalColumn;
