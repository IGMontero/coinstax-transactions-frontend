import React, { useEffect, useState } from 'react';
import { Input, Button } from 'reactstrap';
import {
  fetchBlockchainContracts,
  editBlockChainContract,
} from '../../slices/blockchainContracts/thunk';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { handleActionResult } from '../../utils/useHandleAction';
import EditBlockChainContract from '../DashboardTransactions/HistorialComponents/modals/EditBlockChainContract';
import BlockChainContractTable from '../../Components/Tables/BlockChainContractTable';

const DashboardBlockchainContracts = () => {
  const dispatch = useDispatch();

  const errorMessageEdit = useSelector(
    (state) => state.blockchainContracts.error,
  );

  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [contracts, setContracts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  const [modalEdit, setModalEdit] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const [search, setSearch] = useState('');

  const [triggerSearch, setTriggerSearch] = useState(false);
  const handleOpenModalEdit = (contract) => {
    setModalEdit(!modalEdit);
    setSelectedContract(contract);
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

  const handleChangePage = (page) => {
    setCurrentPage(page);
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

  const handleCheckIsERC20 = (e, contract) => {
    e.stopPropagation();
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

        <BlockChainContractTable
          loading={loading}
          errorMessageEdit={errorMessageEdit}
          setLoading={setLoading}
          contracts={contracts}
          setContracts={setContracts}
          setCurrentPage={setCurrentPage}
          onRefresh={getBlockchainContracts}
          pagination={{
            handleChangePage,
            currentPage,
            pageSize,
            total,
            hasMore,
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardBlockchainContracts;
