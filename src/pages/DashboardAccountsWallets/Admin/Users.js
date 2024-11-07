import React, { useEffect, useState } from 'react';
import { getUsersByAdmin } from '../../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import UserAdminTable from './components/UsersAdminTable';

const Users = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize, setPageSize] = useState(0);

  // Add state for accountType
  const [accountType, setAccountType] = useState('');

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleAccountTypeChange = (event) => {
    setAccountType(event.target.value);
    setCurrentPage(0);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getUsersByAdmin({ page: currentPage, accountType }),
      ).unwrap();

      if (response && !response.error) {
        setUsers(response.data);
        setTotal(response.total);
        setHasMore(response.hasMore);
        setPageSize(response.pageSize);
      } else {
        console.log('Failed to fetch users');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, accountType]);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Users</h1>

        <select
          value={accountType}
          onChange={handleAccountTypeChange}
          className="form-select w-25"
          aria-label="Select Account Type"
        >
          <option value="">All Types</option>
          <option value="accountant">Accountant</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <UserAdminTable
        users={users}
        loading={loading}
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
