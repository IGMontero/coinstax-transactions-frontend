import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getInfoClientByAccountantId } from '../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import ClientInfo from './components/ClientInfo';

const DashboardClientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { userId } = useParams();

  const [client, setClient] = useState(null);
  const [modalConnectWallet, setModalConnectWallet] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handeGoToDashboard = () => {
    navigate('/clients');
  };

  const toggleModalConnectWallet = () => {
    setModalConnectWallet(!modalConnectWallet);
  };

  const fetchClientInfo = async () => {
    try {
      const response = await dispatch(
        getInfoClientByAccountantId({
          clientId: userId,
          accountantId: user.id,
        }),
      ).unwrap();
      if (response && !response.error) {
        setClient(response);
        return response.UserId;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchClientInfo();
      setIsInitialized(true);
    };
    initialize();
  }, []);

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center page-content">
        <Helmet title="Wallets" />
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <div className="mt-5" style={{ maxWidth: '610px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Client Profile</h1>
          <div className="d-flex">
            <Button
              onClick={toggleModalConnectWallet}
              className="d-flex btn-hover-light text-dark justify-content-center align-items-center"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              <i className="ri-add-line me-2"></i>
              Add Wallet
            </Button>
            <Button
              onClick={handeGoToDashboard}
              className=" d-flex btn-hover-light  text-dark justify-content-center align-items-center ms-3"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              <i className="ri-arrow-left-s-line me-2"></i>
              Back To Clients
            </Button>
          </div>
        </div>
        <div className="mb-5 mt-2">
          <ClientInfo client={client} />
        </div>
        <AddressesTable
          userId={client?.UserId}
          modalConnectWallet={modalConnectWallet}
          setModalConnectWallet={setModalConnectWallet}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardClientProfile;
