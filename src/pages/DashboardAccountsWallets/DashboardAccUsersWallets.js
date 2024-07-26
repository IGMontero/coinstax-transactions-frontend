import React, { useEffect, useState } from 'react';
import { Container, Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserWallets } from '../../slices/userWallets/thunk';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';

const DashboardAccUsersWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [addresses, setAddresses] = useState([]);

  const handeGoToDashboard = () => {
    navigate('/clients');
  };

  const fetchUserWallets = async () => {
    try {
      const response = await dispatch(getUserWallets(userId)).unwrap();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const [modalConnectWallet, setModalConnectWallet] = useState(false);

  const toggleModalConnectWallet = () => {
    setModalConnectWallet(!modalConnectWallet);
  };

  useEffect(() => {
    fetchUserWallets();
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        onRefresh={fetchUserWallets}
        userId={userId}
      />
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Client Addresses</h1>
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
          user={false}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardAccUsersWallets;
