import React from 'react';
import { copyToClipboard } from '../../../../../../utils/utils';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

const ApprovalColumn = ({ transaction }) => {
  const isApproval = transaction?.txSummary?.approval;

  const [isCopied, setIsCopied] = React.useState(false);

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
        <>
          <div className={`image-container me-2`}>
            <img
              src={isApproval?.logo || isApproval.displayName}
              alt={isApproval?.displayName}
              className="ps-0 rounded"
              width={35}
              height={35}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const container = e.target.parentNode;
                const textNode = document.createElement('div');
                textNode.textContent = isApproval.displayName;
                textNode.className = 'currency-placeholder';
                container.appendChild(textNode);
              }}
            />{' '}
          </div>
          <div className="d-flex flex-column">
            <span className={`d-flex text-white'`}>
              <span
                onClick={(e) => {
                  handleCopyValue(e, isApproval?.value);
                }}
                id={`amount-${transaction.txHash}`}
                className={`me-1 text-displayName `}
              >
                {isApproval?.displayName}
              </span>
              {isApproval?.value ? (
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
                      {isCopied ? 'Copied' : isApproval?.value}
                    </span>
                  </PopoverBody>
                </UncontrolledPopover>
              ) : null}
            </span>

            {isApproval &&
            !isApproval.hideNativeAmount &&
            isApproval.prettyNativeAmount ? (
              <p className="text-start d-flex align-items-center my-0 text-muted">
                {isApproval.prettyNativeAmount}
              </p>
            ) : (
              <>
                {transaction &&
                transaction.txHash &&
                !isApproval.hideNativeAmount
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
      </h6>
    </div>
  );
};
export default ApprovalColumn;
