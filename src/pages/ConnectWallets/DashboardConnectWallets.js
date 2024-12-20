import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'reactstrap';
import Swal from 'sweetalert2';
import { useConnect, useConnections } from 'wagmi';
import { walletConnectConnectorsData } from '../../common/constants';
import { layoutModeTypes } from '../../Components/constants/layout';
import Helmet from '../../Components/Helmet/Helmet';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';
import ParentComponentSearchBar from '../../Components/SearchBar/ParentComponent';
import { saveTokenInCookies } from '../../helpers/cookies_helper';
import {
  useRefreshUserPortfolio,
  useUserPortfolioSummary,
} from '../../hooks/useUserPortfolio';
import { addUserWallet } from '../../slices/userWallets/thunk';
import DashboardUserWallets from '../DashboardAccountsWallets/DashboardUserWallets';

const DashboardConnectWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const refreshUserPortfolio = useRefreshUserPortfolio();
  const userPortfolioSummary = useUserPortfolioSummary();
  const { user } = useSelector((state) => state.auth);
  const { loaders } = useSelector((state) => state.userWallets);
  const userId = user?.id;
  const userAddresses = userPortfolioSummary?.addresses;

  const accessTokenParams = new URLSearchParams(location.search);
  const accessToken = accessTokenParams.get('access_token');
  const errorParam = accessTokenParams.get('error');

  useEffect(() => {
    if (accessToken) {
      saveTokenInCookies(accessToken);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('access_token');
      window.history.replaceState({}, document.title, newUrl);

      window.location.reload();
    }
    if (errorParam) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred to login. Please try again.',
      });
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  // const { walletInfo } = useWalletInfo();

  // const chainId = useChainId();
  const { connect, reset } = useConnect();

  const [loading, setLoading] = useState(false);
  const [loadingConnectInfo, setLoadingConnectInfo] = useState({
    loading: false,
    error: null,
    name: '',
    message: '',
  });
  const [searchValue, setSearchValue] = useState('');

  const [initialLoad, setInitialLoad] = useState(true);
  const loadingPortoflioAddresses = loaders.userPortfolioSummary;

  useEffect(() => {
    // Initialize: if there are no collected wallets, send user to connect wallet page.
    // if (!hasConnectedWallets) {
    //   console.log('No connected wallets');
    //   navigate('/wallets/connect');
    // }

    if (initialLoad) {
      setInitialLoad(false);
      if (user) refreshUserPortfolio();
    }
  }, [initialLoad]);

  const handleConnect = (connector) => {
    if (connector.missing) {
      return setLoadingConnectInfo({
        open: true,
        loading: false,
        error: null,
        name: connector?.name,
        message: `${connector?.name} extension not found. Please install the extension and try again.`,
      });
    }

    if (!connector) {
      return setLoadingConnectInfo({
        loading: false,
        open: true,
        error: null,
        name: '',
        message: `Could not connect to ${connector?.name}. Please try again.`,
      });
    } else {
      setLoadingConnectInfo({
        loading: true,
        open: true,
        error: null,
        name: connector.name,
        message: `Connecting to ${connector.name}`,
      });
    }

    // // If it's loading reutrn
    // if (loadingConnectInfo.loading) return;

    try {
      connect(
        {
          connector,
        },
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

              return;
              // setLoadingConnectInfo({
              //   loading: false,
              //   open: true,
              //   error: error,

              //   name: connector.name,
              //   message: `Permission to connect already requested. Please check your wallet to approve the connection.`,
              // });
            } else if (errorName === 'UserRejectedRequestError') {
              return setLoadingConnectInfo({
                loading: false,
                open: true,
                error: error,
                name: connector.name,
                message: `Unfortunately, we could not connect to your wallet. Please try again.`,
              });
            } else {
              return setLoadingConnectInfo({
                loading: false,
                open: true,
                error: error,
                name: connector.name,
                message: error.message,
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
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
    }

    async function handleConnectedAccount() {
      if (!connector || !connector?.getAccounts) {
        setLoadingConnectInfo({
          loading: false,
          open: true,
          error: null,
          name: '',
          message: `Could not connect to ${connector?.name}. Please try again.`,
        });
      }

      const accounts = await connector.getAccounts();

      // connect(connector);

      // Open connector again

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

      // Before navigation, show a message saying that it's connecting and load it. then navigate after 2 seconds.
      setLoadingConnectInfo({
        loading: true,
        error: null,
        open: true,
        name: connector.name,
        message: `Address ${addressToNavigate} connected.`,
      });

      setTimeout(() => {
        setLoadingConnectInfo({
          loading: false,
          error: null,
          name: '',
          message: '',
        });

        refreshUserPortfolio();
        navigate(`/address/${addressToNavigate}`);
      }, 2000);
    }

    handleConnectedAccount();
  };

  const renderConnectors = () =>
    walletConnectConnectorsData.map((connector) => {
      // Find connector in connections. If it's connected, show a disconnect button. Just a symbol in red background.
      // const isConnected = connections.find(
      //   (connection) => connection.connector.id === connector.id,
      // );
      // const connectorConnected = isConnected?.connector;

      // Get connector from the list of connectors
      return (
        <div key={connector.uid} className="d-flex flex-column">
          <ConnectorButton
            key={connector.uid}
            id={connector.id}
            name={connector.name}
            logo={connector.logo}
            handleConnect={handleConnect}
          />
        </div>
      );
    });


  return (
    <>
      <div className="page-content">
        <Helmet title="Connect Wallet" />
        <div className="d-flex justify-content-center flex-column align-items-center mt-5">
          <div
            style={{
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
            className="connector-container mt-5 pt-5 mb-5"
          >
            {renderConnectors()}
          </div>

          <div
            style={{
              maxWidth: 450,
            }}
            className="w-100 py-3"
          >
            <div className="d-flex align-items-center justify-content-center">
              {/* <SearchBarWallets onSearch={handleSearch} /> */}
              <ParentComponentSearchBar
                trackWallets={true}
                searchInput={searchValue}
                setSearchInput={setSearchValue}
              />
            </div>
          </div>

          {userAddresses?.length > 0 && (
            <DashboardUserWallets
              userPortfolioSummary={userPortfolioSummary}
              userAddresses={userAddresses}
              user={user}
              loading={loadingPortoflioAddresses}
              initialLoad={initialLoad}
            />
          )}
        </div>

        <ConnectWalletModal
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
    </>
  );
};

function ConnectorButton({ id, name, logo, handleConnect }) {
  const [ready, setReady] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const location = useLocation();
  const { connectors } = useConnect();
  const connections = useConnections();

  console.log('Connectors: ', connectors);

  const [connector, setConnector] = React.useState(null);
  useEffect(() => {
    const connector = connectors.find((c) => c.id === id);
    setConnector(connector);
  }, [connectors, id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const connectorToSelect = searchParams.get('connect');

    // Flag to track if the effect has already been executed
    let hasRun = false;

    if (connectorToSelect && !hasRun) {
      // Map connector to select key.
      const connectorKey = walletConnectConnectorsData.find(
        (i) => i.urlId === connectorToSelect,
      )?.id;

      if (!connectorKey) {
        console.warn('No connector key matches the selected ID.');
        return;
      }

      // Check if connector exists and has the id of the connector to select
      const isThisConnector = connector?.id === connectorKey;

      if (!isThisConnector) {
        return;
      }

      if (connector) {
        handleConnect(connector);
        hasRun = true; // Mark the effect as having run
      } else {
        console.warn('No connector matches the selected ID.');
      }
    }
  }, [location.search, connector]);

  const handleClick = () => {

    if (handleConnect) {
      if (connector) {
        handleConnect(connector);
      } else {
        handleConnect({
          name,
          missing: true,
        });
      }
    }
  };
  const isConnected = connections.find(
    (connection) => connection?.connector?.id === connector?.id,
  );
  const connectorConnected = isConnected?.connector;


  return (
    <>

      <div
        className="connector-item cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="connector-item-inner">
          {(isHovered) && connectorConnected && (
            <div
              className="close-button rounded bg bg-soft-danger p-0 d-flex"
              onClick={(e) => {
                e.stopPropagation();


                connectorConnected
                  .disconnect(connectorConnected)
                  .then(() => {
                    // Reload page
                    window.location.reload();
                  })
                  .catch((error) => {
                    console.error('Failed to disconnect wallet: ', error);
                  })
              }

              }
            >
              <i className="bx bx-x text-danger "></i>

            </div>
          )}
          <div
            className="more-card"
          // onClick={() => {
          //   handleClick();
          // }}
          >
            <div className="icon-wrapper">
              <img src={logo} alt="binnace" className="card-image" />
            </div>
          </div>
          <div className="description-wrapper">
            <span className="name">{name}</span>
            <span className="button-with-arrow">
              {connectorConnected ? 'Connected' : 'Connect'}

              {connectorConnected ? (
                <i className="bx bx-check-circle text-success"></i>
              ) : (
                <i className="icon-Arrow-More">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12H20M20 12L14 6M20 12L14 18"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </i>
              )}


            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const DisconnectButton = ({ connector, onDisconnect }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const buttonRef = useRef(null); // Reference to the disconnect button

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  // Ensure the tooltip is only shown if the button is rendered
  useEffect(() => {
    if (!buttonRef.current) {
      setTooltipOpen(false); // Close tooltip if the button is no longer in DOM
    }
  }, [buttonRef.current]);

  return (
    <>
      <div
        ref={buttonRef}
        id={`disconnectButton-${connector.uid}`}
        onClick={onDisconnect}
        className="d-flex justify-content-center align-items-center cursor-pointer"
      >
        <div className="text-danger">
          <i className="bx bx-x-circle"></i>
        </div>
      </div>

      {buttonRef.current && (
        <Tooltip
          placement="top"
          isOpen={tooltipOpen}
          target={`disconnectButton-${connector.uid}`}
          toggle={toggleTooltip}
        >
          Disconnect {connector.name}
        </Tooltip>
      )}
    </>
  );
};

export default DashboardConnectWallets;
