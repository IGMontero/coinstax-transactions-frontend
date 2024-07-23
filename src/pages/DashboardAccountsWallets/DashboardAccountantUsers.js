import React, { useEffect, useState } from 'react';
import AddressTable from './components/tables/AddressTable';
import { Button, Container } from 'reactstrap';
import { useSelector } from 'react-redux';
import UsersTable from './components/tables/UsersTable';
import Helmet from '../../Components/Helmet/Helmet';
import AddClientModal from '../../Components/Modals/AddClientModal';
import { getClientsByUserId } from '../../slices/clients/thunk';
import { useDispatch } from 'react-redux';

const DashboardAccountantUsers = () => {
  const [fakeUsers, setFakeUsers] = useState([
    {
      id: 1,
      name: 'John Doe',

      email: 'JhonDoe@emial.com',
      address: '0x1234567890',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'JaneDoe@email.com',
      address: '0x123456789',
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'JhonSmith@email.com',
      address: '0x123456789',
    },
    {
      id: 4,
      name: 'Jane Smith',
      email: 'JaneSmith@email.com',
      address: '0x123456789',
    },
  ]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const [modalAddClient, setModalAddClient] = useState(false);
  const handleOpenModalAddClient = () => {
    setModalAddClient(true);
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getClientsByUserId()).unwrap();

      console.log(response);
      if (response && !response.error) {
        setClients(response);
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
  }, []);

  return (
    <React.Fragment>
      <AddClientModal isOpen={modalAddClient} setIsOpen={setModalAddClient} />
      <Helmet title="Clients" />
      <div className="page-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Manage Clients</h1>
            <div>
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
              {/* <Button color="primary">Connect Wallet</Button> */}
            </div>
          </div>
          <UsersTable users={fakeUsers} loading={loading} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAccountantUsers;
