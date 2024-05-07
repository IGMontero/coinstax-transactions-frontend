import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  PopoverBody,
  Spinner,
  Table,
  UncontrolledDropdown,
  UncontrolledPopover,
} from 'reactstrap';
import TablePagination from '../Pagination/TablePagination';
import {
  blockchainContractTrustedStateEnumType,
  capitalizeFirstLetter,
  copyToClipboard,
  formatIdTransaction,
} from '../../utils/utils';
import { handleActionResult } from '../../utils/useHandleAction';
import {
  deleteBlockchainContract,
  editBlockChainContract,
  setBlockchainContractAsDirty,
  updateTrustedState,
  setAllAsDirty,
} from '../../slices/blockchainContracts/thunk';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

const BlockChainContractTable = ({
  contracts,
  setContracts,
  pagination,
  onRefresh,
  loading,
  setLoading,
  errorMessageEdit,
}) => {
  const dispatch = useDispatch();

  const [loadingUpdateTrustedState, setLoadingUpdateTrustedState] =
    useState(false);
  const [updatingContractId, setUpdatingContractId] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const [isEditingCoinGeckoId, setIsEditingCoinGeckoId] = useState(false);
  const [coinGeckoIdValue, setCoinGeckoIdValue] = useState('');
  const [activeEditId, setActiveEditId] = useState(null);

  const handleCopyValue = (e, text) => {
    e.stopPropagation();
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleEditClick = (contract) => {
    setActiveEditId(contract.Id);
    setCoinGeckoIdValue(contract.CoinGeckoId || '');

    console.log('contract', contract);
  };

  const handleCancel = () => {
    setActiveEditId(null);
  };

  const handleSetAllAsDirty = async (address) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `All transactions linked to address ${address} will be set as dirty.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const actionResult = await dispatch(
          setAllAsDirty({
            type: 'contracts',
            blockchain: 'ethereum',
            address,
          }),
        );

        const errorMessage = 'Error to set address as dirty';

        const wasSuccessful = await handleActionResult(
          setAllAsDirty,
          actionResult,
          errorMessageEdit,
          errorMessage,
          () => {
            Swal.fire(
              'Success',
              `All transactions with address ${address} have been set as dirty.`,
              'success',
            );

            onRefresh();
          },
        );
        if (!wasSuccessful) {
          return;
        }
      } catch (error) {
        console.error('Error setting all as dirty', error);
        Swal.fire('Error', error.toString(), 'error');
      }
    }
  };

  const handleCheckIsERC20 = async (e, contract) => {
    e.stopPropagation();
    try {
      const actionResult = await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: contract.Address,
          data: {
            IsERC20: !contract.IsERC20,
          },
        }),
      );

      const errorMessage = 'Error editing blockchain contract';
      const wasSuccessful = await handleActionResult(
        editBlockChainContract,
        actionResult,
        errorMessageEdit,
        errorMessage,
        () => {
          //   Swal.fire(
          //     'Success',
          //     'Blockchain Contract updated successfully',
          //     'success',
          //   );
          onRefresh();
        },
      );

      if (!wasSuccessful) {
        return;
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An unexpected error occurred.', 'error');
    }
  };

  const handleChangeCoinGeckoId = async (
    contract,
    newCoinGeckoId = coinGeckoIdValue,
  ) => {
    try {
      const actionResult = await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: contract.Address,
          data: {
            CoinGeckoId: newCoinGeckoId,
          },
        }),
      );

      const errorMessage = 'Error editing blockchain contract';
      await handleActionResult(
        editBlockChainContract,
        actionResult,
        errorMessageEdit,
        errorMessage,
        () => {
          onRefresh();
          setActiveEditId(null); // Reset editing state
        },
      );
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An unexpected error occurred.', 'error');
    }
  };

  const handleSetAsDirty = async (address) => {
    try {
      const actionResult = await dispatch(
        setBlockchainContractAsDirty({
          blockchain: 'ethereum',
          address,
        }),
      );

      const errorMessage = 'Error setting address as dirty';
      const wasSuccessful = await handleActionResult(
        setBlockchainContractAsDirty,
        actionResult,
        errorMessageEdit,
        errorMessage,
        () => {
          Swal.fire(
            'Success',
            `All transactions with address ${address} have been set as dirty.`,
            'success',
          );

          onRefresh();
        },
      );

      if (!wasSuccessful) {
        return;
      }
    } catch (error) {
      console.error('Error setting as dirty', error);
      Swal.fire('Error', error.toString(), 'error');
    }
  };

  const handleDeleteBlockchainContract = async (contract) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the contract with address ${contract.Address}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const actionResult = await dispatch(
          deleteBlockchainContract({
            blockchain: 'ethereum',
            address: contract.Address,
          }),
        );

        const errorMessage = 'Error deleting blockchain contract';
        // const updateContractResponse = actionResult.payloa
        const wasSuccessful = await handleActionResult(
          deleteBlockchainContract,
          actionResult,
          errorMessageEdit,
          errorMessage,
          () => {
            setContracts(contracts.filter((c) => c.Id !== contract.Id));

            Swal.fire(
              'Success',
              `Blockchain Contract with address ${contract.Address} deleted successfully`,
              'success',
            );
          },
        );

        if (!wasSuccessful) {
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error('Error deleting blockchain contract', error);
        Swal.fire('Error', error.toString(), 'error');
        setLoading(false);
      }
    }
  };

  const handleUpdateTrustedState = async (contract, state) => {
    try {
      setUpdatingContractId(contract.Id);
      const actionResult = await dispatch(
        updateTrustedState({
          blockchain: 'ethereum',
          address: contract.Address,
          trustedState: state,
        }),
      );
      const errorMessage = 'Error updating trusted state';
      const updatedContract = actionResult.payload;
      const wasSuccessful = await handleActionResult(
        updateTrustedState,
        actionResult,
        errorMessageEdit,
        errorMessage,
        () => {
          setContracts(
            contracts.map((c) =>
              c.Id === updatedContract.Id ? updatedContract : c,
            ),
          );
          Swal.fire(
            'Success',
            `Trusted state set to ${updatedContract.TrustedState}.`,
            'success',
          );
        },
      );

      if (!wasSuccessful) {
        return;
      }

      setUpdatingContractId(null);
    } catch (error) {
      Swal.fire('Error', 'Error updating trusted state', error.toString());
      console.log(error);
    } finally {
      setUpdatingContractId(null);
    }
  };

  const renderDropdown = (contract) => {
    const portalRoot = document.getElementById('portal-root');
    return portalRoot
      ? ReactDOM.createPortal(
          <DropdownMenu>
            <DropdownItem onClick={() => handleOpenModalEdit(contract)}>
              Edit
            </DropdownItem>
            <DropdownItem onClick={() => handleSetAllAsDirty(contract.Address)}>
              Set All Tx as Dirty
            </DropdownItem>
            <DropdownItem
              onClick={() => handleDeleteBlockchainContract(contract)}
            >
              Delete
            </DropdownItem>
            <DropdownItem onClick={() => handleSetAsDirty(contract.Address)}>
              Set as Dirty
            </DropdownItem>
          </DropdownMenu>,

          portalRoot,
        )
      : null;
  };

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const renderDropdownTrustedState = (contract) => {
    const portalRoot = document.getElementById('portal-root');
    return portalRoot
      ? ReactDOM.createPortal(
          <DropdownMenu>
            <DropdownItem
              onClick={() =>
                handleUpdateTrustedState(
                  contract,
                  blockchainContractTrustedStateEnumType.UNKNOUN,
                )
              }
            >
              {capitalizeFirstLetter(
                blockchainContractTrustedStateEnumType.UNKNOUN,
              )}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                handleUpdateTrustedState(
                  contract,
                  blockchainContractTrustedStateEnumType.TRUSTED,
                )
              }
            >
              {capitalizeFirstLetter(
                blockchainContractTrustedStateEnumType.TRUSTED,
              )}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                handleUpdateTrustedState(
                  contract,
                  blockchainContractTrustedStateEnumType.SCAM,
                )
              }
            >
              {capitalizeFirstLetter(
                blockchainContractTrustedStateEnumType.SCAM,
              )}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                handleUpdateTrustedState(
                  contract,
                  blockchainContractTrustedStateEnumType.SPAM,
                )
              }
            >
              {capitalizeFirstLetter(
                blockchainContractTrustedStateEnumType.SPAM,
              )}
            </DropdownItem>
          </DropdownMenu>,
          portalRoot,
        )
      : null;
  };

  return (
    <>
      <Table
        stlyle={{ overflow: 'auto' }}
        shadow
        responsive
        className="position-relative"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Blockchain</th>
            <th>Address</th>
            <th>Type</th>
            <th>Name</th>
            <th>Logo</th>
            <th>Symbol</th>
            <th>IsERC20</th>
            <th>CoinGeckoId</th>
            <th>Trusted State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style={{ position: 'relative' }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(5px)',
                zIndex: 10,
              }}
            >
              <Spinner style={{ width: '3rem', height: '3rem' }} />
            </div>
          )}
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <tr style={{ height: 60 }} key={contract.Id}>
                <td className="align-middle">{contract.Id}</td>
                <td className="align-middle">{contract.Blockchain}</td>
                <td className="align-middle">
                  <span
                    id={`popoverAddress-${contract.Id}-${contract.Address}`}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleCopyValue(e, contract.Address)}
                  >
                    {formatIdTransaction(contract.Address, 4, 4)}
                  </span>
                  <UncontrolledPopover
                    trigger="hover"
                    placement="right"
                    target={`popoverAddress-${contract.Id}-${contract.Address}`}
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
                        {isCopied ? 'Copied' : contract.Address}
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover>
                </td>
                <td className="align-middle">{contract.Type}</td>
                <td className="align-middle">
                  {formatIdTransaction(contract.Name, 4, 4)}
                </td>
                <td className="align-middle">
                  <img
                    src={contract.Logo || contract.Blockchain}
                    alt={contract.Logo}
                    className="ps-0 rounded"
                    width={35}
                    height={35}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const container = e.target.parentNode;
                      const textNode = document.createElement('div');
                      // textNode.textContent = ;
                      textNode.className = '';
                      container.appendChild(textNode);
                    }}
                  />
                </td>
                <td className="align-middle">{contract.Symbol}</td>
                <td className="align-middle">
                  <input
                    type="checkbox"
                    className="form-check-input cursor-pointer"
                    onChange={(e) => handleCheckIsERC20(e, contract)}
                    checked={contract.IsERC20}
                  />
                </td>
                <td className="align-middle">
                  {activeEditId !== contract.Id ? (
                    <div className="d-flex align-items-center">
                      {contract.CoinGeckoId}
                      <span onClick={() => handleEditClick(contract)}>
                        {contract.CoinGeckoId ? (
                          <i className="ri-pencil-fill ms-2 cursor-pointer"></i>
                        ) : (
                          <i className="ri-add-fill ms-2 cursor-pointer"></i>
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center  px-0 ms-0 me-0">
                      <input
                        type="text"
                        className="form-control text-start"
                        style={{ height: '25px', width: '100px' }}
                        value={coinGeckoIdValue}
                        onChange={(e) => setCoinGeckoIdValue(e.target.value)}
                      />
                      <i
                        className="ri-check-fill ms-2 cursor-pointer"
                        onClick={() => handleChangeCoinGeckoId(contract)}
                      ></i>
                      {contract.CoinGeckoId ? (
                        <i
                          className="ri-delete-bin-6-line ms-2 cursor-pointer"
                          onClick={() => {
                            setCoinGeckoIdValue('');
                            setActiveEditId(null);
                            handleChangeCoinGeckoId(contract, '');
                          }}
                        ></i>
                      ) : (
                        <i
                          className="ri-close-fill ms-2 cursor-pointer"
                          onClick={() => handleCancel()}
                        ></i>
                      )}
                    </div>
                  )}
                </td>

                <td className="align-middle">
                  <ButtonGroup onClick={(e) => e.stopPropagation()}>
                    <UncontrolledDropdown
                      className="d-flex align-items-center"
                      disabled={loadingUpdateTrustedState}
                    >
                      <DropdownToggle
                        tag="a"
                        className="nav-link cursor-pointer "
                        caret
                      >
                        {updatingContractId === contract.Id ? (
                          <Spinner
                            style={{ width: '1.5rem', height: '1.5rem' }}
                          />
                        ) : (
                          contract.TrustedState
                        )}
                      </DropdownToggle>
                      {renderDropdownTrustedState(contract)}
                    </UncontrolledDropdown>
                  </ButtonGroup>
                </td>
                <td className="align-middle">
                  <ButtonGroup onClick={(e) => e.stopPropagation()}>
                    <UncontrolledDropdown className="cursor-pointer">
                      <DropdownToggle tag="a" className="nav-link">
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      {renderDropdown(contract)}
                    </UncontrolledDropdown>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                <h4>No contracts found</h4>
              </td>
            </tr>
          )}
        </tbody>
        {contracts.length > 0 && (
          <TablePagination
            onChangePage={pagination.handleChangePage}
            currentPage={pagination.currentPage}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          />
        )}
      </Table>
      <div id="portal-root"></div>
    </>
  );
};

export default BlockChainContractTable;
