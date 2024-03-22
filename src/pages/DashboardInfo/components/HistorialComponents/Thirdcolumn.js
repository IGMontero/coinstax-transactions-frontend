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
import { useDispatch, useSelector } from 'react-redux';
import { handleActionResult } from '../../../../utils/useHandleAction';

const ThirdColumn = ({ transaction, index, onRefresh, setTransactions }) => {
  const dispatch = useDispatch();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const errorMessageEdit = useSelector(
    (state) => state.blockchainContracts.error,
  );

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleOpenModalEdit = (contract) => {
    setOpenModalEdit(!openModalEdit);
    setTransactionToEdit(contract);
  };

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const currentUser = localStorage.getItem('currentUser');

  const blockchainContractAddress =
    transaction.txSummary.mainContractAddress ||
    (transaction.blockchainAction === blockchainActions.RECEIVE
      ? transaction.sender
      : transaction.recipient);
  const blockchainContractName =
    transaction.txSummary.mainContractAddressInfo?.name ||
    transaction.txSummary.marketplaceName ||
    blockchainContractAddress;
  const blockchainContractLogo =
    transaction.txSummary.mainContractAddressInfo?.logo ||
    transaction.txSummary.marketplaceLogo;

  const contractLabel =
    transaction.blockchainAction === blockchainActions.RECEIVE
      ? 'From'
      : transaction.blockchainAction === blockchainActions.SEND
        ? 'To'
        : 'Application';

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

    console.log(
      'handleClick -> blockchainContractAddress',
      blockchainContractAddress,
    );

    handleCopyToClipboard(e, blockchainContractAddress, targetId);
  };

  const handleEditBlockChainContract = async (data) => {
    try {
      setLoadingUpdate(true);
      if (!blockchainContractAddress) {
        Swal.fire('Error', 'No Address found ', 'error');
        setLoadingUpdate(false);
        return;
      }
      const actionResult = await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: blockchainContractAddress,
          data,
        }),
      );

      const errorMessage = 'Error editing blockchain contract';

      const wasSuccessful = await handleActionResult(
        editBlockChainContract,
        actionResult,
        errorMessageEdit,
        errorMessage,
        (res) => {
          const updatedInfo = res;
          setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) => {
              const transactionHasMainContract =
                transaction?.txSummary?.mainContractAddress ===
                blockchainContractAddress;

              if (transactionHasMainContract) {
                const newTransaction = { ...transaction };

                const newTxSummary = { ...newTransaction.txSummary };

                const newMainContractAddressInfo = {
                  ...newTxSummary.mainContractAddressInfo,
                };

                newMainContractAddressInfo.address = updatedInfo.Address;
                newMainContractAddressInfo.name =
                  updatedInfo.Name || newMainContractAddressInfo.name;
                newMainContractAddressInfo.logo =
                  updatedInfo.Logo || newMainContractAddressInfo.logo;

                newTxSummary.mainContractAddressInfo =
                  newMainContractAddressInfo;

                newTransaction.txSummary = newTxSummary;

                newTransaction.marketplaceName = updatedInfo.Name;
                newTransaction.marketplaceLogo = updatedInfo.Logo;

                return newTransaction;
              }
              return transaction;
            }),
          );

          Swal.fire(
            'Success',
            'Blockchain Contract updated successfully',
            'success',
          );

          setLoadingUpdate(false);
          setOpenModalEdit(false);
        },
      );

      if (!wasSuccessful) {
        setLoadingUpdate(false);
        return;
      }
    } catch (error) {
      console.log('Error editing blockchain contract', error);
      Swal.fire('Error', 'Error editing blockchain contract', 'error');
    } finally {
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
      <div className="d-flex flex-column w-100  ">
        <p
          style={{ fontSize: '12px', marginBottom: '4px' }}
          className="text-start mb-1"
        >
          {contractLabel}
        </p>
        <div
          title={`${blockchainContractAddress}`}
          className="d-flex align-items-end "
        >
          <h6
            id={`popoverMarketplace-${transaction.txHash}`}
            className="fw-semibold my-0 text-start d-flex align-items-center text-contractLabel"
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
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <span className="text-hover-underline text-contractLabel">
                {formatIdTransaction(blockchainContractName, 4, 4)}
              </span>
            </>
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
          {user && (
            <i
              onClick={(e) =>
                handleOpenModalEdit(transaction, e.stopPropagation())
              }
              className="ri-pencil-line mb-0 ms-2"
            ></i>
          )}
        </div>
      </div>
    </>
  );
};

export default ThirdColumn;
