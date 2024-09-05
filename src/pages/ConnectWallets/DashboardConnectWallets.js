import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { useChainId, useConnect } from 'wagmi';
import metamaskLogo from '../../assets/images/wallets/metamask.svg';
import walletConnect from '../../assets/images/wallets/WalletConnect.png';
import Helmet from '../../Components/Helmet/Helmet';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import { validConnectorIds } from '../../Providers/ConnectWalletProvider';
import { addUserWallet } from '../../slices/userWallets/thunk';
import SearchBarWallets from '../DashboardAccountsWallets/components/SearchBarWallets';
import ModalLoader from '../../Components/Modals/ModalLoader';
const DashboardConnectWallets = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const refreshUserPortfolio = useRefreshUserPortfolio();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  // const { walletInfo } = useWalletInfo();

  const chainId = useChainId();
  const { connectors, connect } = useConnect();

  const validConnectors = connectors.filter((connector) =>
    validConnectorIds.includes(connector.id),
  );

  const [loading, setLoading] = useState(false);

  const wallets = [
    {
      icon: walletConnect,
      name: 'WalletConnect',
      link: '',
      handler: () => {
        const walletConnectConnector = validConnectors.find(
          (connector) => connector.id === 'walletConnect',
        );

        console.log('WalletConnect Connector:', walletConnectConnector);

        if (walletConnectConnector) {
          connect({
            connector: walletConnectConnector,
            chainId,
          });
        }
      },
    },

    {
      icon: metamaskLogo,
      name: 'MetaMask',
      link: '',
      handler: () => {
        const metamaskConnector = validConnectors.find(
          (connector) => connector.id === 'io.metamask',
        );

        if (metamaskConnector) {
          connect({
            connector: metamaskConnector,
            chainId,
          });
        }
      },
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
          {validConnectors.map((connector) => (
            <ConnectorButton
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector, chainId })}
            />
          ))}
        </div>
        <div className="w-50 py-3">
          <span>Track any wallet</span>
          <div className="d-flex align-items-center">
            <SearchBarWallets onSearch={handleSearch} />
            {searchValue && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function ConnectorButton({ connector, onClick }) {
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
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

  const logo = connector.id === 'walletConnect' ? walletConnect : metamaskLogo;

  return (
    <>
      <div
        className="d-flex btn-hover-light p-2 rounded cursor-pointer flex-column mx-4 align-items-center
      "
        onClick={ready && !connector.active && !loading ? handleClick : null}
      >
        <img
          className="img-fluid avatar-md mb-2"
          src={logo}
          alt={connector.name}
        />
        {connector.name}
      </div>
      <ModalLoader isOpen={loading} onClose={handleCloseLoader} />
    </>
  );
}

export default DashboardConnectWallets;
