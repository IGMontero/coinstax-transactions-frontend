import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  PopoverBody,
  Spinner,
  Table,
  UncontrolledDropdown,
  UncontrolledPopover,
} from 'reactstrap';
import {
  getUserAddresses,
  refreshAllTransactions,
  deleteUsersAddress,
  deleteHistoricalBalance,
} from '../../slices/userAddresses/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import TablePagination from '../../Components/Pagination/TablePagination';
import Swal from 'sweetalert2';
import { setAllAsDirty } from '../../slices/blockchainContracts/thunk';
import { handleActionResult } from '../../utils/useHandleAction';
import NetworkDropdown from '../../Components/NetworkDropdown/NetworkDropdown';
import { selectNetworkType } from '../../slices/networkType/reducer';

const DashboardUserAddresses = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  const networkType = useSelector(selectNetworkType);

  const errorMessageEdit = useSelector(
    (state) => state.blockchainContracts.error,
  );

  const fetchUserAddresses = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getUserAddresses({
          page: currentPage,
          address: search,
          networkType,
        }),
      );
      const responseData = response.payload.data || response.payload;
      if (
        responseData &&
        typeof responseData === 'object' &&
        !Array.isArray(responseData)
      ) {
        setUserAddresses([responseData]);
        setHasMore(false);
      } else if (Array.isArray(responseData)) {
        setUserAddresses(responseData);
        setHasMore(response.payload.hasMore || false);
        setTotal(response.payload.total || responseData.length);
      } else {
        setUserAddresses([]);
        setHasMore(false);
        setTotal(0);
      }
      setPageSize(response.payload.pageSize);
    } catch (error) {
      console.error('Failed to fetch user addresses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [triggerSearch, currentPage, networkType]);

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
      setTriggerSearch(false);
    }
  }, [triggerSearch]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleRefreshAllTransactions = async (item) => {
    setLoading(true);
    try {
      const actionResult = await dispatch(
        refreshAllTransactions({
          networkType: item.Blockchain,
          address: item.Address,
        }),
      );

      const errorMessage = 'Error to refresh all transactions';
      const wasSuccessful = await handleActionResult(
        refreshAllTransactions,
        actionResult,
        errorMessageEdit,
        errorMessage,
        (response) => {
          Swal.fire(
            'Success',
            'All transactions have been refreshed',
            'success',
          );
          fetchUserAddresses();
        },
      );

      if (!wasSuccessful) {
        return;
      }
    } catch (error) {
      console.error('Failed to refresh all transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetAllAsDirty = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `All transactions linked to address ${item.Address} will be set as dirty.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const actionResult = await dispatch(
          setAllAsDirty({
            type: 'addresses',
            networkType: item.Blockchain,
            address: item.Address,
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
              `All transactions with address ${item.Address} have been set as dirty.`,
              'success',
            );

            fetchUserAddresses();
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

  const handleDeleteUserAddress = async (item) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete all transactions for address ${item.Address}?`,
      // text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete all transactions',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const actionResult = await dispatch(
          deleteUsersAddress({
            networkType: item.Blockchain,
            address: item.Address,
          }),
        );

        const errorMessage = 'Error deleting user address transactions';
        const updateUserAddresses = actionResult;
        const wasSuccessful = await handleActionResult(
          deleteUsersAddress,
          actionResult,
          errorMessageEdit,
          errorMessage,
          () => {
            // set user addresses
            setUserAddresses(
              userAddresses.map((u) =>
                u.Id === updateUserAddresses.Id ? updateUserAddresses : u,
              ),
            );
            Swal.fire('Deleted!', 'Transactions have been deleted.', 'success');
          },
          fetchUserAddresses(),
        );

        if (!wasSuccessful) {
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error('Error deleting user address', error);
        Swal.fire('Error', error.toString(), 'error');
        setLoading(false);
      }
    }
  };

  const handleDeleteAllUserAddressTransactions = async (item) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete all transactions for address ${item.Address}?`,
      // text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete all transactions',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const actionResult = await dispatch(
          deleteUsersAddress({
            networkType: 'all',
            address: item.Address,
          }),
        );

        const errorMessage = 'Error deleting user address transactions';
        const updateUserAddresses = actionResult;
        const wasSuccessful = await handleActionResult(
          deleteUsersAddress,
          actionResult,
          errorMessageEdit,
          errorMessage,
          () => {
            // set user addresses
            setUserAddresses(
              userAddresses.map((u) =>
                u.Id === updateUserAddresses.Id ? updateUserAddresses : u,
              ),
            );
            Swal.fire('Deleted!', 'Transactions have been deleted.', 'success');
          },
          fetchUserAddresses(),
        );

        if (!wasSuccessful) {
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error('Error deleting user address', error);
        Swal.fire('Error', error.toString(), 'error');
        setLoading(false);
      }
    }
  };

  const handleDeleteHistoricalBalance = async (item) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete historical balances for address ${item.Address}?`,
      // text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete historical balances',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const actionResult = await dispatch(
          deleteHistoricalBalance({
            networkType: item.Blockchain,
            address: item.Address,
          }),
        );

        const errorMessage =
          'There was an error deleting the historical balances';

        const wasSuccessful = await handleActionResult(
          deleteHistoricalBalance,
          actionResult,
          errorMessageEdit,
          errorMessage,
          () => {
            Swal.fire(
              'Deleted!',
              'Historical balances have been deleted.',
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
        console.log('Error deleting historical balance', error);
        Swal.fire('Error', error.toString(), 'error');
        setLoading(false);
      }
    }
  };

  const handleCopyValue = (e, text) => {
    e.stopPropagation();
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const renderDropdown = (item) => {
    const portalRoot = document.getElementById('portal-root');
    return portalRoot
      ? ReactDOM.createPortal(
        <DropdownMenu>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleRefreshAllTransactions(item)}
          >
            Refresh All Transactions
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleSetAllAsDirty(item)}
          >
            Set All Tx as Dirty
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleDeleteUserAddress(item)}
          >
            Delete Transactions for {item.Blockchain}
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleDeleteAllUserAddressTransactions(item)}
          >
            Delete Transactions for All Blockchains
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleDeleteHistoricalBalance(item)}
          >
            Delete Historical Balances
          </DropdownItem>
        </DropdownMenu>,
        portalRoot,
      )
      : null;
  };

  document.title = 'User Addresses | Chain Glance';

  return (
    <div className=" mt-5" style={{ minHeight: '100vh' }}>
      <div className="d-flex justify-content-end">
        <NetworkDropdown />
      </div>
      <h3>User Addresses</h3>
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
            <th>Processing</th>
            <th>Last Page Processed</th>
            <th>All Txs Processed</th>
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
          {userAddresses && userAddresses.length > 0 ? (
            userAddresses?.map((item) => (
              <tr style={{ height: 60 }} key={item.Id}>
                <td className="align-middle">{item.Id}</td>
                <td className="align-middle">{item.Blockchain}</td>
                <td className="align-middle">
                  <span
                    id={`popoverAddress-${item.Id}-${item.Address}`}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => handleCopyValue(e, item.Address)}
                  >
                    {formatIdTransaction(item.Address, 4, 4)}
                  </span>
                  <UncontrolledPopover
                    trigger="hover"
                    placement="right"
                    target={`popoverAddress-${item.Id}-${item.Address}`}
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
                        {isCopied ? 'Copied' : item.Address}
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover>
                </td>
                <td className="align-middle">
                  {item.IsProcessingTransactions ? 'Yes' : 'No'}
                </td>
                <td className="align-middle">
                  {item.LastTransactionsPageProcessed}
                </td>
                <td className="align-middle">
                  {item.AllTransactionsProcessed ? 'Yes' : 'No'}
                </td>
                <td className="align-middle ">
                  <ButtonGroup onClick={(e) => e.stopPropagation()}>
                    <UncontrolledDropdown className="cursor-pointer">
                      <DropdownToggle tag="a" className="nav-link">
                        <i className="ri-more-2-fill"></i>
                      </DropdownToggle>
                      {renderDropdown(item)}
                    </UncontrolledDropdown>
                  </ButtonGroup>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                <h4>No user addresses found</h4>
              </td>
            </tr>
          )}
        </tbody>
        {userAddresses.length && !loading ? (
          <TablePagination
            onChangePage={handleChangePage}
            currentPage={currentPage}
            totalPages={Math.ceil(total / pageSize)}
          />
        ) : null}
      </Table>
      <div id="portal-root"></div>
    </div>
  );
};

export default DashboardUserAddresses;
