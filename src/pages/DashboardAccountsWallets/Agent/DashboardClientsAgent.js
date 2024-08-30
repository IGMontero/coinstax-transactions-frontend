import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UsersTable from '../components/tables/UsersTable';
import Helmet from '../../../Components/Helmet/Helmet';

import { useDispatch } from 'react-redux';
import { getAgentsClients } from '../../../slices/agents/thunks';

const DashboardClientsAgent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const agentId = user?.agentId;

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const fetchAgentClients = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getAgentsClients({ agentId, page: currentPage }),
      ).unwrap();

      console.log('response', response);
      if (response && !response.error) {
        setClients(response.data);
        setTotal(response.total);
        setPageSize(response.pageSize);
        setHasMore(response.hasMore);
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
    fetchAgentClients();
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Clients" />
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Manage Clients</h1>
      </div>
      <UsersTable
        users={clients}
        loading={loading}
        onDelete={() => {}}
        onRefresh={fetchAgentClients}
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

export default DashboardClientsAgent;
