import React, { useEffect, useState } from 'react';
import { Container, Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import Header from '../../Layouts/Header';
import { getUserWallets } from '../../slices/clients/thunk';
import { useDispatch } from 'react-redux';
import AddClientModal from '../../Components/Modals/AddClientModal';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';

const DashboardUserWallets = () => {
  // const addresses = useSelector((state) => state.addressName.addresses);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalConnectWallet, setModalConnectWallet] = useState(false);

  const toggleModalConnectWallet = () =>
    setModalConnectWallet(!modalConnectWallet);

  const fetchUserWallets = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getUserWallets(userId)).unwrap();

      console.log(response);
      if (response && !response.error) {
        setAddresses(response);
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
    fetchUserWallets();
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        onRefresh={fetchUserWallets}
      />
      <div className="page-content">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Manage Wallets</h1>
            <div className="d-flex ">
              <Button
                className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
                color="soft-light"
                style={{
                  borderRadius: '10px',
                  border: '.5px solid grey',
                }}
              >
                Sync Addresses
              </Button>
              <Button
                onClick={toggleModalConnectWallet}
                className="d-flex btn-hover-light  text-dark justify-content-center align-items-center"
                color="soft-light"
                style={{
                  borderRadius: '10px',
                  border: '.5px solid grey',
                }}
              >
                Connect Wallet
              </Button>
            </div>
          </div>
          <AddressesTable
            addresses={addresses}
            setAddresses={setAddresses}
            user={user}
            loading={loading}
            onRefresh={fetchUserWallets}
          />
          {/* <div className="mt-4">
            <h2>Watchlist</h2>
            <div className="watchlist-placeholder">
              <p>Drag your wallets here</p>
            </div>
          </div> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardUserWallets;
