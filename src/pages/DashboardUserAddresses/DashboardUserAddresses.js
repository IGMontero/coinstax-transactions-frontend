import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  PopoverBody,
  Spinner,
  Table,
  UncontrolledPopover,
} from 'reactstrap';
import { getUserAddresses } from '../../slices/userAddresses/thunk';
import { useDispatch } from 'react-redux';
import { formatIdTransaction } from '../../utils/utils';
import TablePagination from '../../Components/Pagination/TablePagination';

const DashboardUserAddresses = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getUserAddresses({
          page: currentPage,
          address: search,
          blockchain: 'ethereum',
        }),
      );

      setUserAddresses(response.payload.data);
      setHasMore(response.payload.hasMore);
      setPageSize(response.payload.pageSize);
      setTotal(response.payload.total);

      console.log(response);
    } catch (error) {
      console.error('Failed to fetch user addresses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [triggerSearch, currentPage]);

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

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
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
            userAddresses?.map((address) => (
              <tr style={{ height: 60 }} key={address.Id}>
                <td className="align-middle">{address.Id}</td>
                <td className="align-middle">{address.Blockchain}</td>
                <td className="align-middle">
                  <span
                    id={`popoverAddress-${address.Id}-${address.Address}`}
                    style={{ cursor: 'pointer' }}
                    // onClick={(e) => handleCopyValue(e, addresses.Address)}
                  >
                    {formatIdTransaction(address.Address, 4, 4)}
                  </span>
                  <UncontrolledPopover
                    trigger="hover"
                    placement="right"
                    target={`popoverAddress-${address.Id}-${address.Address}`}
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
                        {address.Address}
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover>
                </td>
                <td className="align-middle">
                  {address.IsProcessingTransactions ? 'Yes' : 'No'}
                </td>
                <td className="align-middle">
                  {address.LastTransactionsPageProcessed}
                </td>
                <td className="align-middle">
                  {address.AllTransactionsProcessed ? 'Yes' : 'No'}
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
        {!userAddresses && !loading && (
          <TablePagination
            onChangePage={handleChangePage}
            currentPage={currentPage}
            totalPages={Math.ceil(total / pageSize)}
          />
        )}
      </Table>
    </div>
  );
};

export default DashboardUserAddresses;
