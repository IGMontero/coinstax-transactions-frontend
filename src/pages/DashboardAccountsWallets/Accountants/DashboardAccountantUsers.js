import React, { useEffect, useState } from 'react';
import AddressTable from '../components/tables/AddressesTable';
import { Button, Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import UsersTable from '../components/tables/UsersTable';
import Helmet from '../../../Components/Helmet/Helmet';
import AddClientModal from '../../../Components/Modals/AddClientModal';

import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import EditClientModal from '../../../Components/Modals/EditClientModal';
import {
  getClientsByAccountantId,
  deleteClientByAccountantId,
} from '../../../slices/accountants/thunk';

const DashboardAccountantUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userId = user.id;

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [modalAddClient, setModalAddClient] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModalAddClient = () => {
    setModalAddClient(true);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getClientsByAccountantId(userId),
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

  const handleDeleteClient = (client) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete client with ID ${client.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteClientByAccountantId({
              clientId: client.id,
              accountantId: userId,
            }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Client deleted successfully',
            });
            fetchClients();
          }
        } catch (error) {
          console.error('Failed to delete client:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete client',
          });
        }

        console.log('Delete client', client.id);
      }
    });
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <React.Fragment>
      <AddClientModal
        isOpen={modalAddClient}
        setIsOpen={setModalAddClient}
        onRefresh={fetchClients}
      />

      <Helmet title="Clients" />
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
        <h1>Manage Clients</h1>
        <div className="d-flex align-items-center">
          <Button
            onClick={handleOpenModalAddClient}
            className="d-flex btn-hover-light  text-dark justify-content-center align-items-center"
            color="soft-light"
            style={{
              borderRadius: '10px',
              border: '.5px solid grey',
            }}
          >
            <i className="ri-add-line me-2"></i>
            Add Client
          </Button>
        </div>
      </div>
      <UsersTable
        users={clients}
        loading={loading}
        onDelete={handleDeleteClient}
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

export default DashboardAccountantUsers;
