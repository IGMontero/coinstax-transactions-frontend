import React, { useEffect, useState } from 'react';
import { getUsersByAdmin } from '../../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import UsersTable from '../components/tables/UsersTable';

const Users = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);

  const [hasMore, setHasMore] = useState(false);

  const [pageSize, setPageSize] = useState(0);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const fetchUsers = async () => {
    try {
      const response = await dispatch(
        getUsersByAdmin({ page: currentPage }),
      ).unwrap();

      if (response && !response.error) {
        setUsers(response.data);
        setTotal(response.total);
        setHasMore(response.hasMore);
        setPageSize(response.pageSize);
      } else {
        console.log('Failed to fetch users');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Clients</h1>
      </div>
      <UsersTable
        users={users}
        loading={loading}
        onDeleteAddress={() => {}}
        onRefresh={fetchUsers}
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

export default Users;
