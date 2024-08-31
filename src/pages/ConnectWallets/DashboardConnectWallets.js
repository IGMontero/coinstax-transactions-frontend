import { useWalletInfo, useWeb3Modal } from '@web3modal/wagmi/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import ledgerWallet from '../../assets/images/wallets/ledgerWallet.svg';
import walletConnect from '../../assets/images/wallets/WalletConnect.png';
import Helmet from '../../Components/Helmet/Helmet';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import { addUserWallet } from '../../slices/userWallets/thunk';
import SearchBarWallets from '../DashboardAccountsWallets/components/SearchBarWallets';
const DashboardConnectWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshUserPortfolio = useRefreshUserPortfolio();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { walletInfo } = useWalletInfo()
  const { open, close } = useWeb3Modal()

  console.log('WALLET INFO:', walletInfo)

  const [loading, setLoading] = useState(false);

  const wallets = [
    // {
    //   icon: zerionWallet,
    //   name: 'Zerion Wallet',
    //   link: '',
    //   handler: () => {},
    // },
    {
      icon: walletConnect,
      name: 'WalletConnect',
      link: '',
      handler: () => {
        open()
      },
    },

    {
      icon: ledgerWallet,
      name: 'Ledger',
      link: '',
      handler: () => { },
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
    setLoading(true);
    try {
      const response = await dispatch(
        addUserWallet({ address, userId }),
      ).unwrap();

      console.log(response);

      if (response && !response.error) {
        navigate(`/address/${address}`);
        refreshUserPortfolio();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'Failed to connect wallet',
          icon: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: error || 'Failed to connect wallet',
        icon: 'error',
      });
      setLoading(false);
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

          {/* <WalletConnectButton /> */}

          {wallets.map((wallet, index) => (
            <div
              key={index}
              className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center
            "
              onClick={wallet.handler}
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
              className={`d-flex btn-hover-light ms-2 p-2  text-dark justify-content-center align-items-center`}
              color="soft-light"
              disabled={loading}
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
                cursor: `${!loading ? 'pointer' : 'not-allowed'}`,
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
              {loading ? (
                <div>
                  <Spinner size="sm" color="light" />
                </div>
              ) : (
                <>Add</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardConnectWallets;
