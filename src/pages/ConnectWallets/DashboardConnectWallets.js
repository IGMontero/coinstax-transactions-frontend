import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { useConnect, useConnections } from 'wagmi';
import coinbaseLogo from '../../assets/images/wallets/coinbase.png';
import metamaskLogo from '../../assets/images/wallets/metamask.svg';
import walletConnectLogo from '../../assets/images/wallets/WalletConnect.png';
import Helmet from '../../Components/Helmet/Helmet';
import {
  useRefreshUserPortfolio,
  useUserPortfolioSummary,
} from '../../hooks/useUserPortfolio';
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
  console.log('Connectors: ', connectors);

  const [loading, setLoading] = useState(false);
  const [loadingConnectInfo, setLoadingConnectInfo] = useState({
    loading: false,
    error: null,
    name: '',
    message: '',
  });
  const [searchValue, setSearchValue] = useState('');

  const allConnectors = [
    {
      name: 'Metamask',
      id: 'io.metamask',
      uid: 'metamask',
      logo: metamaskLogo,
    },
    {
      name: 'WalletConnect',
      id: 'walletConnect',
      uid: 'walletConnect',
      logo: walletConnectLogo,
    },
    {
      name: 'Coinbase Wallet',
      id: 'coinbaseWalletSDK',
      uid: 'coinbaseWallet',
      logo: coinbaseLogo,
    },
  ];

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
    setLoadingConnectInfo({
      open: true,
      loading: true,
      error: null,
      name: connector.name,
      message: '',
    });
    connect(
      { connector },
      {
        onSuccess: handleConnectedAccount,
        onError: (error) => {
          console.error('Failed to connect wallet: ', error);
          console.log(error.code, error.data, error.name);
          const errorName = error.name;
          const errorCode = error.code;

          if (errorName === 'ConnectorAlreadyConnectedError') {
            console.log('Connector was already connected');
          } else if (errorCode === -32002) {
            console.log('Err name: ', errorName);
            console.log('err code: ', error.code);

            return setLoadingConnectInfo({
              loading: false,
              open: true,
              error: error,
              name: connector.name,
              message: `Permission to connect already requested. Please check your wallet to approve the connection.`,
            });
          } else if (errorName === 'UserRejectedRequestError') {
            return setLoadingConnectInfo({
              loading: false,
              open: true,
              error: error,
              name: connector.name,
              message: `Unfortunately, we could not connect to your wallet. Please try again.`,
            });
          }

          // setLoadingConnectInfo({
          //   loading: false,
          //   error: error,
          //   name: connector.name,
          //   message: error.message,
          // });
        },
      },
    );

    async function handleConnectedAccount() {
      const accounts = await connector.getAccounts();

      console.log('Accounts: ', accounts);

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
      setLoadingConnectInfo({
        loading: false,
        error: null,
        name: '',
        message: '',
      });
    }

    handleConnectedAccount();
  };

  const renderConnectors = () =>
    allConnectors.map((connector) => {
      // Get connector from the list of connectors
      return (
        <ConnectorButton
          key={connector.uid}
          id={connector.id}
          name={connector.name}
          logo={connector.logo}
          handleConnect={handleConnect}
        />
      );
    });

  return (
    <div className="page-content ">
      <Helmet title="Connect Wallet" />
      <div className="d-flex justify-content-center flex-column align-items-center">
        <div>
          <h1>Connect to ChainGlance</h1>
        </div>
        <div className="d-flex mt-4 mb-5">{renderConnectors()}</div>
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

      <ModalLoader
        isOpen={loadingConnectInfo.open}
        details={loadingConnectInfo}
        onClose={() => {
          setLoadingConnectInfo({
            open: false,
            loading: false,
            error: null,
            name: '',
            message: '',
          });
        }}
      />
    </div>
  );
};

function ConnectorButton({ id, name, logo, handleConnect }) {
  // const [ready, setReady] = React.useState(false);
  const { connectors } = useConnect();

  const [connector, setConnector] = React.useState(null);

  useEffect(() => {
    const connector = connectors.find((c) => c.id === id);
    setConnector(connector);
  }, [connectors, id]);

  // React.useEffect(() => {
  //   if (!connector) return;

  //   (async () => {
  //     const provider = await connector.getProvider();
  //     setReady(!!provider);
  //   })();
  // }, [connector, setReady]);

  const handleClick = () => {
    // Get connector from the list of connectors

    if (!connector) {
      return Swal.fire({
        // title: 'Error',
        text: `${name} extension not found. Please install the extension and try again.`,
        icon: 'error',
      });
    }

    if (handleConnect) {
      handleConnect(connector);
    }
  };

  return (
    <>
      <div
        className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center"
        onClick={handleClick}
      >
        {logo ? (
          <img className="img-fluid avatar-md mb-2" src={logo} alt={name} />
        ) : (
          <div className="avatar-md mb-2">
            {/* <i className="bx bx-wallet"></i> */}
          </div>
        )}

        {name}
      </div>
    </>
  );
}

export default DashboardConnectWallets;
