import React, { useEffect, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import {
  blockchainActions,
  copyToClipboard,
  formatIdTransaction,
} from '../../../../utils/utils';
import { Link } from 'react-router-dom';
import EditBlockChainContract from './modals/EditBlockChainContract';
import Swal from 'sweetalert2';
import { editBlockChainContract } from '../../../../slices/blockchainContracts/thunk';
import { useDispatch } from 'react-redux';

const ThirdColumn = ({ transaction, index, onRefresh }) => {
  const dispatch = useDispatch();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleOpenModalEdit = (contract) => {
    setOpenModalEdit(!openModalEdit);
    setTransactionToEdit(contract);
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const currentUser = localStorage.getItem('currentUser');

  const blockchainContractAddress = transaction.txSummary.mainContractAddress || (transaction.blockchainAction === blockchainActions.RECEIVE ?
    transaction.sender : transaction.recipient)
  const blockchainContractName = transaction.txSummary.mainContractInfo?.name || transaction.txSummary.marketplaceName || blockchainContractAddress
  const blockchainContractLogo = transaction.txSummary.mainContractInfo?.logo || transaction.txSummary.marketplaceLogo;


  const contractLabel = transaction.blockchainAction === blockchainActions.RECEIVE ? 'From' : transaction.blockchainAction === blockchainActions.SEND ? 'To' : 'Application';


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
    // if (
    //   transaction.blockchainAction === blockchainActions.RECEIVE ||
    //   transaction.blockchainAction === blockchainActions.SEND
    // ) {
    //   return;
    // }

    console.log("handleClick -> blockchainContractAddress", blockchainContractAddress)

    handleCopyToClipboard(e, blockchainContractAddress, targetId);
  };

  const handleEditBlockChainContract = async (data) => {
    try {
      setLoadingUpdate(true);
      const address = transactionToEdit.txSummary.mainContractAddress;
      if (!address) {
        Swal.fire('Error', 'No Address found ', 'error');
        setLoadingUpdate(false);
        return;
      }

      await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: address,
          data,
        }),
      );
      Swal.fire('Success', 'Blockchain Contract updated successfully', 'success');
      setLoadingUpdate(false);
      setOpenModalEdit(false);
      onRefresh();
    } catch (error) {
      setLoadingUpdate(true);
      console.log('Error editing blockchain contract', error);
      Swal.fire('Error', 'Error editing blockchain contract', 'error');
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      <EditBlockChainContract
        transactionToEdit={transactionToEdit}
        open={openModalEdit}
        loading={loadingUpdate}
        onEdit={handleEditBlockChainContract}
        setOpen={setOpenModalEdit}
      />
      <div className="d-flex flex-column w-100">
        <p
          style={{ fontSize: '12px', marginBottom: '4px' }}
          className="text-start  mb-1"
        >
          {contractLabel}
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
            <>
              {blockchainContractLogo && (
                <img
                  src={blockchainContractLogo}
                  alt={blockchainContractName}
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
                  blockchainContractName,
                  4,
                  4,
                )}
              </span>
            </>
            {/* {transaction.txSummary && transaction.txSummary.marketplaceName ? (
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
                    blockchainContractName,
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
            )} */}
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
                handleOpenModalEdit(transaction, e.stopPropagation())
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