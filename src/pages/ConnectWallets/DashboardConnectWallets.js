import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { useChainId, useConnect, useConnections } from 'wagmi';
import metamaskLogo from '../../assets/images/wallets/metamask.svg';
import walletConnect from '../../assets/images/wallets/WalletConnect.png';
import Helmet from '../../Components/Helmet/Helmet';
import {
  useRefreshUserPortfolio,
  useUserPortfolioSummary,
} from '../../hooks/useUserPortfolio';
import { validConnectorIds } from '../../Providers/ConnectWalletProvider';
import { addUserWallet } from '../../slices/userWallets/thunk';
import SearchBarWallets from '../DashboardAccountsWallets/components/SearchBarWallets';
import ModalLoader from '../../Components/Modals/ModalLoader';
const DashboardConnectWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshUserPortfolio = useRefreshUserPortfolio();
  const userPortfolioSummary = useUserPortfolioSummary();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  console.log('userPortfolio', userPortfolioSummary);
  // const { walletInfo } = useWalletInfo();

  // const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const connections = useConnections();
  console.log('Connections:', connections);

  const validConnectors = connectors.filter((connector) =>
    validConnectorIds.includes(connector.id),
  );

  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const handleSearchWallet = (value) => {
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

  const handleConnect = (connector) => {
    connect(
      { connector },
      {
        onSuccess: handleConnectedAccount,
        onError: (error) => {
          console.error('Failed to connect wallet: ', error);
          console.log(error.code, error.data, error.name);
          const errorName = error.name;

          if (errorName === 'ConnectorAlreadyConnectedError') {
            console.log('Connector was already connected');
          }
        },
      },
    );

    async function handleConnectedAccount() {
      const accounts = await connector.getAccounts();

      // For each account do the same. Only navigate to the first one.

      const mainAddress = accounts[0];

      if (!mainAddress) return;

      for (let i = 0; i < accounts.length; i++) {
        const accountAddress = accounts[i];
        const isAddressAlreadyInPortfolio =
          userPortfolioSummary?.addresses?.find(
            (address) =>
              address.address.toLowerCase() === accountAddress.toLowerCase(),
          );

        if (isAddressAlreadyInPortfolio) continue;
        // Add address to user wallet
        await dispatch(
          addUserWallet({
            address: accountAddress,
            userId,
          }),
        );
      }

      const addressToNavigate = mainAddress?.toLowerCase();
      // navigate to the first account
      navigate(`/address/${addressToNavigate}`);

      refreshUserPortfolio();
    }

    handleConnectedAccount();
  };

  return (
    <div className="page-content ">
      <Helmet title="Connect Wallet" />
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div>
          <h1>Connect to ChainGlance</h1>
        </div>
        <div className="d-flex mt-4 mb-5">
          {validConnectors.map((connector) => (
            <ConnectorButton
              key={connector.uid}
              connector={connector}
              onClick={() => handleConnect(connector)}
            />
          ))}
        </div>
        <div className="w-50 py-3">
          <span>Track any wallet</span>
          <div className="d-flex align-items-center">
            <SearchBarWallets onSearch={handleSearch} />
            <Button
              className={`d-flex btn-hover-light ms-2 p-2  text-dark justify-content-center align-items-center`}
              color="soft-light"
              disabled={loading || !searchValue}
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
                cursor: `${!loading ? 'pointer' : 'not-allowed'}`,
              }}
              onClick={() => {
                if (!user) {
                  handleSearchWallet(searchValue);
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

function ConnectorButton({ connector, onClick }) {
  const [ready, setReady] = React.useState(false);
  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  const handleClick = () => {
    setLoading(true);
    onClick();
  };

  const handleCloseLoader = () => {
    setLoading(false);
  };

  // Get logo based on connector id

  let logo;

  switch (connector.id) {
    case 'walletConnect':
      logo = walletConnect;
      break;
    case 'io.metamask':
      logo = metamaskLogo;
      break;
    default:
      logo = '';
  }

  return (
    <div
      className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center
            "
      onClick={ready && !connector.active ? () => onClick() : () => { }}
    >
      {logo ? (
        <img
          className="img-fluid avatar-md mb-2"
          src={logo}
          alt={connector.name}
        />
      ) : (
        <div className="avatar-md mb-2">{/* {connector.name} */}</div>
      )}

      {connector.name}
    </div>
  );
}

export default DashboardConnectWallets;
