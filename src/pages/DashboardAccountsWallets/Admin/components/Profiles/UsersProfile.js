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
  deleteClientByAccountantId,
  getClientsByAccountantId,
  getInfoClientByAccountantId,
  getUserByIdAdmin,
} from '../../../../../slices/accountants/thunk';
import { getClientUserPortfolioSummary } from '../../../../../slices/userWallets/thunk';
import { useDispatch } from 'react-redux';
import ClientInfo from '../../../components/ClientInfo';
import AddAccManager from '../../../../../Components/Modals/AddAccManager';
import UserInfo from '../../../components/UserInfo';
import UsersTable from '../../../components/tables/UsersTable';
import Swal from 'sweetalert2';

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

  const [accountantClients, setAccountantClients] = useState([]);

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
        setAccountantClients(response.data);
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

  const handleDeleteClient = (client) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete client with ID ${client.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteClientByAccountantId({
              clientId: client.id,
              accountantId: userId,
            }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Client deleted successfully',
            });
            fetchAccountantClients();
          }
        } catch (error) {
          console.error('Failed to delete client:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete client',
          });
        }

        console.log('Delete client', client.id);
      }
    });
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
    fetchUserWallets(userId);
  };

  const handleBackButton = () => {
    navigate('/admin/users');
  };

  const renderButton = (condition, onClick, icon, label) => (
    <Button
      onClick={onClick}
      className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
      color="soft-light"
      style={{
        borderRadius: '10px',
        border: '.5px solid grey',
      }}
    >
      {icon && <i className={`${icon} me-2`}></i>}
      {label}
    </Button>
  );

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
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1>User Profile</h1>
          <div className="d-flex align-items-center">
            {!isAccountantProfile &&
              renderButton(
                false,
                handleBackButton,
                'ri-arrow-left-s-line',
                'Back to Users',
              )}
            {renderButton(
              false,
              isAccountantProfile
                ? handleBackButton
                : toggleModalAddAccountManager,
              isAccountantProfile ? 'ri-arrow-left-s-line' : null,
              isAccountantProfile ? 'Back to Users' : 'Add Account Manager',
            )}
            {renderButton(
              false,
              toggleModalConnectWallet,
              null,
              'Connect Wallet',
            )}
          </div>
        </div>
        <div className="mb-5 mt-2">
          {isAccountantProfile ? (
            <UserInfo user={user} />
          ) : (
            <ClientInfo client={user} />
          )}
        </div>
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
        <div>
          <AddressesTable
            userId={userId}
            initialAddresses={addresses}
            loading={loadingWallets}
            onRefresh={handleRefreshPortfolio}
          />
        </div>
        {isAccountantProfile && (
          <div className="mt-4">
            <h4>
              Clients{' '}
              <span className="text-muted">
                ({accountantClients.length} out of {total})
              </span>
            </h4>
            <UsersTable
              users={accountantClients}
              loading={loading}
              onDelete={handleDeleteClient}
              onRefresh={fetchAccountantClients}
              pagination={{
                handleChangePage,
                currentPage,
                pageSize,
                total,
                hasMore,
              }}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default UsersProfile;
