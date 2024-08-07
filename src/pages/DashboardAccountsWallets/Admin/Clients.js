import React, { useEffect, useState } from 'react';
import { getClientsByAdmin } from '../../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import UsersTable from '../components/tables/UsersTable';
import { Button } from 'reactstrap';

const Clients = () => {
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [hasMore, setHasMore] = useState(false);

  const [pageSize, setPageSize] = useState(0);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getClientsByAdmin({ page: currentPage }),
      ).unwrap();

      if (response && !response.error) {
        setClients(response.data);
        setTotal(response.total);
        setHasMore(response.hasMore);
        setPageSize(response.pageSize);
      } else {
        console.log('Failed to fetch clients');
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Clients</h1>
      </div>
      <UsersTable
        users={clients}
        loading={loading}
        onDeleteAddress={() => {}}
        onRefresh={fetchClients}
        pagination={{
          handleChangePage,
          currentPage,
          pageSize,
          total,
          hasMore,
        }}
      />
    </React.Fragment>
  );
};

export default Clients;
