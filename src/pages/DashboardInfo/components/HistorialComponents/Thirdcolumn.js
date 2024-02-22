import React, { useEffect, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import {
  blockchainActions,
  formatIdTransaction,
} from '../../../../utils/utils';
import { Link } from 'react-router-dom';

const ThirdColumn = ({ transaction, index }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleCopyToClipboard = async (e, text, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setTargetId(targetId);
      setPopoverOpen(true);
      const newTimeoutId = setTimeout(() => {
        setPopoverOpen(false);
      }, 2000);
      setTimeoutId(newTimeoutId);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleClick = (e, transaction, targetId) => {
    e.stopPropagation();
    if (
      transaction.blockchainAction === blockchainActions.RECEIVE ||
      transaction.blockchainAction === blockchainActions.SEND
    ) {
      return;
    }
    handleCopyToClipboard(e, transaction.recipient, targetId);
  };

  return (
    <div
      className="d-flex flex-column text-start"
      style={{ overflow: 'hidden' }}
    >
      <p className="text-start my-0">
        {transaction.blockchainAction === blockchainActions.RECEIVE
          ? 'From'
          : transaction.blockchainAction === blockchainActions.SEND
            ? 'To'
            : 'Application'}
      </p>
      <h6
        id={`popoverMarketplace-${index}`}
        className="fw-semibold my-0 text-start d-flex align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={(e) =>
          handleClick(e, transaction, `popoverMarketplace-${index}`)
        }
      >
        {transaction.txSummary && transaction.txSummary.marketplaceName ? (
          <>
            {transaction.txSummary.marketplaceLogo && (
              <img
                src={transaction.txSummary.marketplaceLogo}
                alt={transaction.txSummary.marketplaceName}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  marginRight: '5px',
                }}
              />
            )}
            <span className="text-hover-underline">
              {transaction.txSummary.marketplaceName}
            </span>
          </>
        ) : transaction.blockchainAction === blockchainActions.RECEIVE ||
          transaction.blockchainAction === blockchainActions.SEND ? (
          <Link
            target="_blank"
            className="text-decoration-none"
            to={`https://etherscan.io/address/${transaction.blockchainAction === blockchainActions.RECEIVE ? transaction.sender : transaction.recipient}`}
          >
            <span className="text-hover-underline">
              {formatIdTransaction(
                transaction.blockchainAction === blockchainActions.RECEIVE
                  ? transaction.sender
                  : transaction.recipient,
                4,
                4,
              )}
            </span>
          </Link>
        ) : (
          <span className="text-hover-underline">
            {formatIdTransaction(transaction.recipient, 4, 4)}
          </span>
        )}
        <Popover
          placement="right"
          isOpen={popoverOpen && targetId === `popoverMarketplace-${index}`}
          target={`popoverMarketplace-${index}`}
        >
          <PopoverBody className="p-1">Copied</PopoverBody>
        </Popover>
      </h6>
    </div>
  );
};

export default ThirdColumn;
