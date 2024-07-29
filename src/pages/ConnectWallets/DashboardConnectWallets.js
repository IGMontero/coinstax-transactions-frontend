import React, { useState } from 'react';
import Helmet from '../../Components/Helmet/Helmet';
import SearchBar from '../../Components/SearchBar/SearchBar';
import ledgerWallet from '../../assets/images/wallets/ledgerWallet.svg';
import walletConnect from '../../assets/images/wallets/WalletConnect.png';
import zerionWallet from '../../assets/images/wallets/zerionWallet.svg';
import SearchBarWallets from '../DashboardAccountsWallets/components/SearchBarWallets';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addUserWallet } from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';
const DashboardConnectWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const wallets = [
    {
      icon: zerionWallet,
      name: 'Zerion Wallet',
      link: '',
      handler: () => {},
    },
    {
      icon: walletConnect,
      name: 'WalletConnect',
      link: '',
      handler: () => {},
    },

    {
      icon: ledgerWallet,
      name: 'Ledger',
      link: '',
      handler: () => {},
    },
  ];

  const [searchValue, setSearchValue] = useState('');

  const handleAddWallet = (value) => {
    navigate(`/address/${value}`);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleConnectWallet = async (address) => {
    try {
      const response = await dispatch(
        addUserWallet({ address, userId }),
      ).unwrap();

      if (response && !response.error) {
        navigate(`/address/${address}`);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to connect wallet',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to connect wallet',
        icon: 'error',
      });
    }
  };

  return (
    <div className="page-content ">
      <Helmet title="Connect Wallet" />
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div>
          <h1>Connect to ChainGlance</h1>
        </div>
        <div className="d-flex mt-4 mb-5">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center
            
            "
            >
              <img
                className="img-fluid avatar-md mb-2"
                src={wallet.icon}
                alt={wallet.name}
              />
              {wallet.name}
            </div>
          ))}
        </div>
        <div className="w-50 py-3">
          <span>Track any wallet</span>
          <div className="d-flex align-items-center">
            <SearchBarWallets onSearch={handleSearch} />
            <Button
              className="d-flex btn-hover-light ms-2 p-2  text-dark justify-content-center align-items-center"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
              onClick={() => {
                if (!user) {
                  handleAddWallet(searchValue);
                } else {
                  handleConnectWallet(searchValue);
                }
              }}
            >
              <i className="bx bx-plus me-2"></i>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardConnectWallets;
