import React, { useEffect, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import {
  blockchainActions,
  copyToClipboard,
  formatIdTransaction,
} from '../../../../utils/utils';
import { Link } from 'react-router-dom';
import EditBlockChainContract from './modals/EditBlockChainContract';

const ThirdColumn = ({ transaction, index }) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const handleOpenModalEdit = (contract) => {
    setOpenModalEdit(!openModalEdit);
    setTransactionToEdit(contract);
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleCopyToClipboard = async (e, text, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      copyToClipboard(text);

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
    <>
      <EditBlockChainContract
        transactionToEdit={transactionToEdit}
        open={openModalEdit}
        setOpen={setOpenModalEdit}
      />
      <div className="d-flex flex-column w-100">
        <p
          style={{ fontSize: '12px', marginBottom: '4px' }}
          className="text-start  mb-1"
        >
          {transaction.blockchainAction === blockchainActions.RECEIVE
            ? 'From'
            : transaction.blockchainAction === blockchainActions.SEND
              ? 'To'
              : 'Application'}
        </p>
        <div className="d-flex align-items-end">
          <h6
            id={`popoverMarketplace-${transaction.txHash}`}
            className="fw-semibold my-0 text-start d-flex align-items-center"
            style={{
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
            }}
            onClick={(e) =>
              handleClick(
                e,
                transaction,
                `popoverMarketplace-${transaction.txHash}`,
              )
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
                      borderRadius: '6px',
                      marginRight: '6px',
                    }}
                  />
                )}
                <span className="text-hover-underline">
                  {formatIdTransaction(
                    transaction.txSummary.marketplaceName,
                    4,
                    4,
                  )}
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
              isOpen={
                popoverOpen &&
                targetId === `popoverMarketplace-${transaction.txHash}`
              }
              target={`popoverMarketplace-${transaction.txHash}`}
            >
              <PopoverBody className="p-1">Copied</PopoverBody>
            </Popover>
          </h6>
          {currentUser && (
            <i
              onClick={(e) =>
                handleOpenModalEdit(transaction.txSummary, e.stopPropagation())
              }
              className="ri-pencil-line ms-2"
            ></i>
          )}
        </div>
      </div>
    </>
  );
};

export default ThirdColumn;
