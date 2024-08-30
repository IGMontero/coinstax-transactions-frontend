import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getInfoClientByAccountantId } from '../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import ClientInfo from './components/ClientInfo';
import { getClientUserPortfolioSummary } from '../../slices/userWallets/thunk';
import {
  CurrencyUSD,
  isDarkMode,
  parseValuesToLocale,
} from '../../utils/utils';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';
import Skeleton from 'react-loading-skeleton';
import { DASHBOARD_USER_ROLES } from '../../common/constants';

const DashboardClientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const currentUserRole = user?.role;
  const { clientId } = useParams();

  const [client, setClient] = useState(null);
  const [modalConnectWallet, setModalConnectWallet] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [clientUserPortfolio, setClientUserPortfolio] = useState(null);

  const addresses = clientUserPortfolio?.addresses;
  const totalPortfolioValue = clientUserPortfolio?.totalValue;
  const parsedTotalPortfolioValue = parseValuesToLocale(
    totalPortfolioValue,
    CurrencyUSD,
  );

  const isClientUserPortfolioComplete = clientUserPortfolio?.complete;

  const [loadingWallets, setLoadingWallets] = useState(false);

  const handeGoToDashboard = () => {
    if (currentUserRole === DASHBOARD_USER_ROLES.ADMIN) {
      navigate('/admin/clients');
    } else {
      navigate('/clients');
    }
  };

  const toggleModalConnectWallet = () => {
    setModalConnectWallet(!modalConnectWallet);
  };

  const fetchClientInfo = async () => {
    try {
      const response = await dispatch(
        getInfoClientByAccountantId({
          clientId: clientId,
          accountantId: user.id,
        }),
      ).unwrap();
      if (response && !response.error) {
        setClient(response);
        return response.UserId;
      } else {
        window.history.back();
      }
    } catch (error) {
      console.log(error);
      window.history.back();
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchClientInfo();
      setIsInitialized(true);
    };

    initialize();
  }, []);

  const fetchUserWallets = async () => {
    setLoadingWallets(true);
    try {
      const response = await dispatch(
        getClientUserPortfolioSummary({ userId: client.UserId }),
      ).unwrap();

      if (response && !response.error) {
        setClientUserPortfolio(response);
      } else {
        // return back window
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWallets(false);
    }
  };

  useEffect(() => {
    if (!clientUserPortfolio) return;

    // If client user portfolio has complete: false, refetch again every 5 seconds until it's complete.
    if (!clientUserPortfolio.complete) {
      const interval = setInterval(() => {
        fetchUserWallets();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [clientUserPortfolio]);

  // const fetchUserWallets = async () => {
  //   setLoadingWallets(true);
  //   try {
  //     console.log("clIENT:", client);
  //     const response = await dispatch(getUserWallets(client.UserId));
  //     console.log(response);

  //     setAddresses(response.payload);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingWallets(false);
  //   }
  // };

  useEffect(() => {
    if (client?.UserId) {
      fetchUserWallets();
    }
  }, [client]);

  if (!isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center page-content">
        <Helmet title="Wallets" />
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet title="Wallets" />
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={client?.UserId}
        onRefresh={fetchUserWallets}
      />

      <div className="mt-5" style={{ maxWidth: '610px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Client Profile</h1>
          <div className="d-flex">
            <Button
              onClick={handeGoToDashboard}
              className=" d-flex btn-hover-light  text-dark justify-content-center align-items-center me-3"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              <i className="ri-arrow-left-s-line me-2"></i>
              Back To Clients
            </Button>
            <Button
              onClick={toggleModalConnectWallet}
              className="d-flex btn-hover-light text-dark justify-content-center align-items-center"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              <i className="ri-add-line me-2"></i>
              Add Wallet
            </Button>
          </div>
        </div>
        <div className="mb-5 mt-2">
          <ClientInfo client={client} />
        </div>
        {!isInitialized ? (
          <div className="d-flex my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (addresses?.length === 0 || !addresses) && !loadingWallets ? (
          <div className="d-flex my-3">
            <h5>No wallets found</h5>
          </div>
        ) : (
          <>
            {/* // toTAL POrtfolio value */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>
                Portfolio Value:{' '}
                {!isClientUserPortfolioComplete ? (
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

            <AddressesTable
              userId={client.UserId}
              addresses={addresses}
              loading={loadingWallets}
              onRefresh={fetchUserWallets}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardClientProfile;
