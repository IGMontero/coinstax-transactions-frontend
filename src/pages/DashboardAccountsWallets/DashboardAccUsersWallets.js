import React, { useState } from 'react';
import { Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardAccUsersWallets = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [addresses, setAddresses] = useState([]);
  const [modalConnectWallet, setModalConnectWallet] = useState(false);

  const handeGoToDashboard = () => {
    navigate('/clients');
  };

  const toggleModalConnectWallet = () => {
    setModalConnectWallet(!modalConnectWallet);
  };

  return (
    <React.Fragment>
      <Helmet title="Wallets" />

      <div className="mt-5">
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


        <AddressesTable
          addresses={addresses}
          setAddresses={setAddresses}
          user={user}
          modalConnectWallet={modalConnectWallet}
          setModalConnectWallet={setModalConnectWallet}
        />
      </div>

    </React.Fragment>
  );
};

export default DashboardAccUsersWallets;
