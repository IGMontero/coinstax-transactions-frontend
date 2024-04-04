import React from 'react';
import {
  copyToClipboard,
  parseValuesToLocale,
} from '../../../../../../utils/utils';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

const ApprovalColumn = ({ transaction }) => {
  const transactionApproval = transaction?.txSummary?.approval;

  const [isCopied, setIsCopied] = React.useState(false);

  const parsedValue = parseValuesToLocale(transactionApproval?.value, '');

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
              src={
                transactionApproval?.logo ||
                transactionApproval.currency ||
                transactionApproval.displayName
              }
              alt={transactionApproval?.displayName}
              className="ps-0 rounded"
              width={35}
              height={35}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const container = e.target.parentNode;
                const textNode = document.createElement('div');
                textNode.textContent =
                  transactionApproval.currency ||
                  transactionApproval.displayName;
                textNode.className = 'currency-placeholder';
                container.appendChild(textNode);
              }}
            />{' '}
          </div>
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
        </>
      </h6>
    </div>
  );
};
export default ApprovalColumn;
