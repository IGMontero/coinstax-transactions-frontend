import React, { useState } from 'react';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import {
  CurrencyUSD,
  isDarkMode,
  parseValuesToLocale,
} from '../../utils/utils';
import Skeleton from 'react-loading-skeleton';
import AddAccManager from '../../Components/Modals/AddAccManager';

const DashboardUserWallets = ({
  userAddresses,
  userPortfolioSummary,
  user,
  initialLoad,
  loading,
}) => {
  const { loaders } = useSelector((state) => state.userWallets);
  const userId = user?.id;
  const refreshUserPortfolio = useRefreshUserPortfolio();

  // const [modalConnectWallet, setModalConnectWallet] = useState(false);

  const [modalAddAccountManager, setModalAddAccountManager] = useState(false);

  // const addresses = userPortfolioSummary?.addresses;
  const totalPortfolioValue = userPortfolioSummary?.totalValue;
  const parsedTotalPortfolioValue = parseValuesToLocale(
    totalPortfolioValue,
    CurrencyUSD,
  );

  const hasConnectedWallets = userAddresses?.length > 0;

  // const toggleModalConnectWallet = () =>
  //   setModalConnectWallet(!modalConnectWallet);

  const toggleModalAddAccountManager = () =>
    setModalAddAccountManager(!modalAddAccountManager);

  const handleRefreshPortfolio = () => {
    refreshUserPortfolio(userId);
  };

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      {/* <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={userId}
        onRefresh={refreshUserPortfolio}
      /> */}

      <AddAccManager
        isOpen={modalAddAccountManager}
        setIsOpen={setModalAddAccountManager}
        userId={userId}
      />
      <div style={{ maxWidth: '610px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1>Manage Wallets </h1>
          <div className="d-flex align-items-center">
            {/* <Button
              onClick={toggleModalAddAccountManager}
              className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              Add Account Manager
            </Button> */}
            {/* <Button
              onClick={handleConnectWallet}
              className="d-flex btn-hover-light  text-dark justify-content-center align-items-center"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              Connect Wallet
            </Button> */}
          </div>
        </div>
        {/* {!loaders.userPortfolioSummary && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )} */}
        {hasConnectedWallets && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>
              Portfolio Value:{' '}
              {loading ? (
                <Skeleton
                  width={80}
                  baseColor={isDarkMode() ? '#333' : '#f3f3f3'}
                  highlightColor={isDarkMode() ? '#444' : '#e0e0e0'}
                />
              ) : (
                parsedTotalPortfolioValue
              )}
            </h4>
          </div>
        )}
        {!loading && (
          <AddressesTable
            userId={userId}
            initialAddresses={userPortfolioSummary?.addresses}
            loading={loaders.userPortfolioSummary}
            onRefresh={handleRefreshPortfolio}
          />
        )}

        {/* <div className="mt-4">
            <h2>Watchlist</h2>
            <div className="watchlist-placeholder">
              <p>Drag your wallets here</p>
            </div>
          </div> */}
      </div>
    </React.Fragment>
  );
};

export default DashboardUserWallets;
