import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Spinner,
  Table,
  UncontrolledDropdown,
  PopoverBody,
  UncontrolledPopover,
  Button,
  ButtonGroup,
} from 'reactstrap';
import {
  fetchBlockchainContracts,
  setAllAsDirty,
  editBlockChainContract,
  updateTrustedState,
  deleteBlockchainContract,
  setBlockchainContractAsDirty,
} from '../../slices/blockchainContracts/thunk';
import {
  blockchainContractTrustedStateEnumType,
  capitalizeFirstLetter,
} from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import TablePagination from '../../Components/Pagination/TablePagination';
import Swal from 'sweetalert2';
import { handleActionResult } from '../../utils/useHandleAction';
import EditBlockChainContract from '../DashboardInfo/components/HistorialComponents/modals/EditBlockChainContract';

const DashboardBlockchainContracts = () => {
  const dispatch = useDispatch();

  const errorMessageEdit = useSelector(
    (state) => state.blockchainContracts.error,
  );

  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [loadingUpdateTrustedState, setLoadingUpdateTrustedState] =
    useState(false);
  const [updatingContractId, setUpdatingContractId] = useState(null);

  const [contracts, setContracts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  const [isCopied, setIsCopied] = useState(false);

  const [modalEdit, setModalEdit] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const [search, setSearch] = useState('');

  const [triggerSearch, setTriggerSearch] = useState(false);
  const handleOpenModalEdit = (contract) => {
    setModalEdit(!modalEdit);
    setSelectedContract(contract);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const getBlockchainContracts = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchBlockchainContracts({
          blockchain: 'ethereum',
          page: currentPage,
          address: search,
        }),
      );

      const responseData = response.payload.data || response.payload;

      if (responseData && Array.isArray(responseData)) {
        setContracts(responseData);
        setHasMore(response.payload.hasMore || false);
        setTotal(response.payload.total || responseData.length);
        setPageSize(response.payload.pageSize);
      } else {
        setContracts([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching blockchain contracts', error);
      setLoading(false);
      setContracts([]);
    }
  };

  const handleSearch = () => {
    setTriggerSearch(true);
  };
  const handleClearSearch = () => {
    setSearch('');
    setCurrentPage(0);
    setTriggerSearch(true);
  };

  useEffect(() => {
    if (triggerSearch) {
      getBlockchainContracts();
      setTriggerSearch(false);
    }
  }, [triggerSearch]);

  useEffect(() => {
    getBlockchainContracts();
  }, [currentPage]);

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

            getBlockchainContracts();
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

          getBlockchainContracts();
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

  const handleEditBlockChainContract = async (data) => {
    try {
      setLoadingUpdate(true);
      const actionResult = await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: selectedContract.Address,
          data,
        }),
      );

      const errorMessage = 'Error editing blockchain contract';
      const wasSuccessful = await handleActionResult(
        editBlockChainContract,
        actionResult,
        errorMessageEdit,
        errorMessage,
        () => {
          Swal.fire(
            'Success',
            'Blockchain Contract updated successfully',
            'success',
          );
          setModalEdit(false);
          getBlockchainContracts();
        },
      );

      if (!wasSuccessful) {
        return;
      }
      setLoadingUpdate(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'An unexpected error occurred.', 'error');
    } finally {
      setLoadingUpdate(false);
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

  const handleCopyValue = (e, text) => {
    e.stopPropagation();
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  document.title = 'Blockchain Contracts';

  return (
    <React.Fragment>
      <EditBlockChainContract
        open={modalEdit}
        loading={loadingUpdate}
        onEdit={handleEditBlockChainContract}
        setOpen={handleOpenModalEdit}
        transactionToEdit={selectedContract}
      />
      <div className="page-content mt-5">
        <h3>Blockchain Contracts</h3>
        <div className="mb-3 mt-2 d-flex justify-content-center align-items-center">
          <Input
            type="text"
            placeholder="Search By Address"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="mx-2"
            disabled={loading || !search}
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button disabled={!search} color="danger" onClick={handleClearSearch}>
            Clear
          </Button>
        </div>

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
                    <ButtonGroup onClick={(e) => e.stopPropagation()}>
                      <UncontrolledDropdown
                        disabled={loadingUpdateTrustedState}
                      >
                        <DropdownToggle
                          tag="a"
                          className="nav-link cursor-pointer"
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
              onChangePage={handleChangePage}
              currentPage={currentPage}
              totalPages={Math.ceil(total / pageSize)}
            />
          )}
        </Table>
        <div id="portal-root"></div>
      </div>
    </React.Fragment>
  );
};

export default DashboardBlockchainContracts;
