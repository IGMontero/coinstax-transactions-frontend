import React, { useEffect, useState } from 'react';
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
} from 'reactstrap';
import {
  fetchBlockchainContracts,
  setAllAsDirty,
  editBlockChainContract,
} from '../../slices/blockchainContracts/thunk';
import { useDispatch } from 'react-redux';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import TablePagination from '../../Components/Pagination/TablePagination';
import Swal from 'sweetalert2';
import EditBlockChainContract from '../DashboardInfo/components/HistorialComponents/modals/EditBlockChainContract';

const DashboardBlockchainContracts = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
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
        await dispatch(
          setAllAsDirty({
            blockchain: 'ethereum',
            address: address,
          }),
        );
        await getBlockchainContracts();
      } catch (error) {
        console.error('Error setting all as dirty', error);
      }
    }
  };

  const handleEditBlockChainContract = async (data) => {
    try {
      setLoadingUpdate(true);
      await dispatch(
        editBlockChainContract({
          blockchain: 'ethereum',
          address: selectedContract.Address,
          data,
        }),
      );
      Swal.fire('Success', 'Blockchain Contract updated successfully', 'success');
      setLoadingUpdate(false);
      setModalEdit(false);
      await getBlockchainContracts();
    } catch (error) {
      setLoadingUpdate(true);
      console.error('Error editing blockchain contract', error);
      Swal.fire('Error', 'Error editing blockchain contract', 'error');
      setLoadingUpdate(false);
    }
  };

  const renderDropdown = (contract) => {
    return (
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="nav-link">
          <i className="ri-more-2-fill"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => handleOpenModalEdit(contract)}>
            Edit
          </DropdownItem>
          <DropdownItem>Update Trusted State</DropdownItem>
          <DropdownItem onClick={() => handleSetAllAsDirty(contract.Address)}>
            Set All Tx as Dirty
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
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
      <div className="page-content" style={{ minHeight: '100vh' }}>
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

        <Table stlyle={{ overflow: 'auto' }} shadow responsive className="position-relative">
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
                      placement="bottom"
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
                  <td className="align-middle">{contract.TrustedState}</td>
                  <td className="align-middle text-center">
                    <span className="cursor-pointer">
                      {renderDropdown(contract)}{' '}
                    </span>
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
      </div>
    </React.Fragment>
  );
};

export default DashboardBlockchainContracts;
