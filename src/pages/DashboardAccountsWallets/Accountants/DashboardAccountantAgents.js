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
import Swal from 'sweetalert2';

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
      setLoading(true);
      const response = await dispatch(
        getAgentsByAccountantId({ accountantId: userId }),
      ).unwrap();

      if (!response.error) {
        setAgents(response.data);
        setPageSize(response.pageSize);
        setTotal(response.total);
        setHasMore(response.hasMore);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agent) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${agent.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await dispatch(
          deleteAgentById({ accountantId: userId, agentId: agent.id }),
        ).unwrap();

        if (response && !response.error) {
          Swal.fire('Deleted!', 'The agent has been deleted.', 'success');
          fetchAgents();
        } else {
          Swal.fire(
            'Error!',
            response.error || 'Something went wrong!',
            'error',
          );
        }
      } catch (error) {
        console.log(error);
        Swal.fire('Error!', 'Something went wrong!', 'error');
      }
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
        <h1>Manage Agents</h1>
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
