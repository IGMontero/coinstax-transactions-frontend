import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import Helmet from '../../../../../Components/Helmet/Helmet';
import AddressesTable from '../../../components/tables/AddressesTable';
import { useSelector } from 'react-redux';

import ConnectWalletModal from '../../../../../Components/Modals/ConnectWalletModal';
import {
  CurrencyUSD,
  isDarkMode,
  parseValuesToLocale,
} from '../../../../../utils/utils';
import Skeleton from 'react-loading-skeleton';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRefreshUserPortfolio } from '../../../../../hooks/useUserPortfolio';
import {
  getClientsByAccountantId,
  getInfoClientByAccountantId,
  getUserByIdAdmin,
} from '../../../../../slices/accountants/thunk';
import { getClientUserPortfolioSummary } from '../../../../../slices/userWallets/thunk';
import { useDispatch } from 'react-redux';
import ClientInfo from '../../../components/ClientInfo';
import AddAccManager from '../../../../../Components/Modals/AddAccManager';
import UserInfo from '../../../components/UserInfo';

const UsersProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useParams();

  const isAccountantProfile = location.pathname.includes('accountants');

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const [hasMore, setHasMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const [user, setUser] = useState(null);
  const [modalConnectWallet, setModalConnectWallet] = useState(false);
  const [modalAddAccountManager, setModalAddAccountManager] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [userPortfolio, setUserPortfolio] = useState(null);

  const addresses = userPortfolio?.addresses;
  const totalPortfolioValue = userPortfolio?.totalValue;
  const parsedTotalPortfolioValue = parseValuesToLocale(
    totalPortfolioValue,
    CurrencyUSD,
  );

  const [loadingInfo, setLoadingInfo] = useState(false);

  const [loadingWallets, setLoadingWallets] = useState(false);

  const toggleModalConnectWallet = () => {
    setModalConnectWallet(!modalConnectWallet);
  };

  const toggleModalAddAccountManager = () =>
    setModalAddAccountManager(!modalAddAccountManager);

  const fetchUserInfo = async () => {
    setLoadingInfo(true);
    try {
      const response = await dispatch(getUserByIdAdmin(userId)).unwrap();

      if (response && !response.error) {
        setUser(response);
      }
      setLoadingInfo(false);
    } catch (error) {
      console.log(error);
      setLoadingInfo(false);
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUserInfo();

      setIsInitialized(true);
    };

    initialize();
  }, []);

  const fetchUserWallets = async () => {
    setLoadingWallets(true);
    try {
      const response = await dispatch(
        getClientUserPortfolioSummary({ userId: userId }),
      ).unwrap();

      if (response && !response.error) {
        setUserPortfolio(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWallets(false);
    }
  };

  const fetchAccountantClients = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getClientsByAccountantId(userId),
      ).unwrap();

      console.log('response', response);
      if (response && !response.error) {
        setUser(response.data);
        setTotal(response.total);
        setPageSize(response.pageSize);
        setHasMore(response.hasMore);
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
    if (isAccountantProfile) {
      fetchAccountantClients();
    }
    fetchUserWallets();
  }, [userId]);

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center page-content">
        <Helmet title="Wallets" />
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const handleRefreshPortfolio = () => {
    console.log('refresh ');
    fetchUserWallets(userId);
  };

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={userId}
        onRefresh={handleRefreshPortfolio}
      />
      <AddAccManager
        isOpen={modalAddAccountManager}
        setIsOpen={setModalAddAccountManager}
        userId={userId}
      />
      <div style={{ maxWidth: '610px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1>User Profile</h1>
          <div className="d-flex align-items-center">
            <Button
              onClick={() => {
                isAccountantProfile
                  ? navigate('/admin/users')
                  : {
                      toggleModalAddAccountManager,
                    };
              }}
              className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              {isAccountantProfile ? (
                <>
                  <i className="ri-arrow-left-s-line me-2"></i>
                  Back to Users
                </>
              ) : (
                'Add Account Manager'
              )}
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
        <div className="mb-5 mt-2">
          {isAccountantProfile ? (
            <UserInfo user={user} />
          ) : (
            <ClientInfo client={user} />
          )}
        </div>
        {/* {!loaders.userPortfolioSummary && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )} */}
        {addresses && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>
              Portfolio Value:{' '}
              {loadingInfo ? (
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

        <AddressesTable
          userId={userId}
          addresses={addresses}
          loading={loadingWallets}
          onRefresh={handleRefreshPortfolio}
        />

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

export default UsersProfile;
