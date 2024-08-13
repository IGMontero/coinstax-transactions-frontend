import React, { useEffect, useState } from 'react';
import UsersTable from '../components/tables/UsersTable';
import { useDispatch } from 'react-redux';
import {
  deleteAgentById,
  getAgentsByAccountantId,
} from '../../../slices/agents/thunks';
import { useSelector } from 'react-redux';
import Helmet from '../../../Components/Helmet/Helmet';
import { Button } from 'reactstrap';
import AddAgentModal from '../../../Components/Modals/ModalAddAgent.js';

const DashboardAccountantAgents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const [agents, setAgents] = useState([]);

  const [modalAddAgent, setModalAddAgent] = useState(false);

  const toggleModalAddAgent = () => {
    setModalAddAgent(true);
  };

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [total, setTotal] = useState(0);

  const [hasMore, setHasMore] = useState(false);

  const fetchAgents = async () => {
    try {
      const response = await dispatch(
        getAgentsByAccountantId({ accountantId: userId }),
      ).unwrap();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await dispatch(deleteAgentById({ accountantId: userId, agentId: id }));
      fetchAgents();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      <AddAgentModal
        isOpen={modalAddAgent}
        setIsOpen={setModalAddAgent}
        onRefresh={fetchAgents}
      />
      <Helmet title="Agents" />
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Manage Clients</h1>
        <div className="d-flex align-items-center">
          <Button
            onClick={() => toggleModalAddAgent()}
            className="d-flex btn-hover-light  text-dark justify-content-center align-items-center"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            <i className="ri-add-line me-2"></i>
            Add Agent
          </Button>
        </div>
      </div>
      <UsersTable
        users={agents}
        loading={loading}
        onDelete={handleDeleteAgent}
        onRefresh={fetchAgents}
        pagination={{
          handleChangePage,
          currentPage,
          pageSize,
          total,
          hasMore,
        }}
      />
    </div>
  );
};

export default DashboardAccountantAgents;
