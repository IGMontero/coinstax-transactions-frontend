import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector, useDispatch } from 'react-redux';
import { setUserPortfolioSummary } from '../../slices/userWallets/reducer';
import {
  deleteUserAddressWallet,
  reorderUserWallets,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';
import useRefreshPortfolio from '../../Components/Hooks/PortfolioHook';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';
import { CurrencyUSD, isDarkMode, parseValuesToLocale } from '../../utils/utils';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

const DashboardUserWallets = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userPortfolioSummary, loaders } = useSelector(
    (state) => state.userWallets,
  );
  const navigate = useNavigate();
  const userId = user?.id;
  // const { refreshPortfolio } = useRefreshPortfolio(userId);
  const userAddresses = userPortfolioSummary?.addresses;
  const refreshUserPortfolio = useRefreshUserPortfolio();

  const [modalConnectWallet, setModalConnectWallet] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // const addresses = userPortfolioSummary?.addresses;
  const totalPortfolioValue = userPortfolioSummary?.totalValue;
  const parsedTotalPortfolioValue = parseValuesToLocale(
    totalPortfolioValue,
    CurrencyUSD,
  );
  const loading = loaders.userPortfolioSummary

  const hasConnectedWallets = userAddresses?.length > 0;


  useEffect(() => {
    // Initialize: if there are no collected wallets, send user to connect wallet page.
    if (!hasConnectedWallets) {
      navigate('/wallets/connect');
    }

    if (initialLoad) {
      setInitialLoad(false);
      refreshUserPortfolio();
    }
  }, []);

  const toggleModalConnectWallet = () =>
    setModalConnectWallet(!modalConnectWallet);

  const handleSetAddresses = (updatedAddresses) => {
    dispatch(setUserPortfolioSummary(updatedAddresses));
  };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Update Wallet Address',
      input: 'text',
      inputValue: address.name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (
          userAddresses?.some(
            (addr) => addr.name === value && addr.address !== address.address,
          )
        ) {
          return 'This name already exists!';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : null;

        try {
          const response = await dispatch(
            updateUserWalletAddress({
              userId,
              name: newName,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            // const updatedAddresses = userAddresses?.map((addr) => {
            //   if (addr.id === address.id) {
            //     return {
            //       ...addr,
            //       name: newName,
            //     };
            //   }
            //   return addr;
            // });

            // handleSetAddresses(updatedAddresses);
            refreshUserPortfolio(userId);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to update address',
              icon: 'error',
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Failed to update address',
            icon: 'error',
          });

          console.log(error);
        }
      }
    });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(userAddresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    handleSetAddresses(updatedItems);

    await handleReorderAddresses(updatedItems);
  };

  const handleReorderAddresses = async (updatedAddresses) => {
    const payload = updatedAddresses.map((address) => ({
      Id: address.id,
      Index: address.index,
    }));

    try {
      const response = await dispatch(
        reorderUserWallets({ userId: userId, addresses: payload }),
      ).unwrap();

      if (response && !response.error) {
        refreshUserPortfolio(userId);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to reorder addresses',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to reorder addresses:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to reorder addresses',
        icon: 'error',
      });
    }
  };

  const handleRefreshPortfolio = () => {
    refreshUserPortfolio(userId);
  };

  const handleDeleteUserAddress = (address) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure to delete wallet ${address.name ? address.name : address.address}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({ userId, addressId: address.id }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });

            refreshUserPortfolio(userId);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete address',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error('Failed to delete address:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete address',
            icon: 'error',
          });
        }
      }
    });
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
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={userId}
        onRefresh={refreshUserPortfolio}
      />
      <div style={{ maxWidth: '610px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
          <h1>Manage Wallets</h1>
          <div className="d-flex ">
            <Button
              className="d-flex btn-hover-light text-dark justify-content-center align-items-center me-2"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              Sync Addresses
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
        {/* {!loaders.userPortfolioSummary && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )} */}
        {hasConnectedWallets && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>Portfolio Value: {(loading) ?
              <Skeleton
                width={80}
                baseColor={isDarkMode() ? '#333' : '#f3f3f3'}
                highlightColor={isDarkMode() ? '#444' : '#e0e0e0'}
              /> :
              parsedTotalPortfolioValue}</h4>
          </div>
        )}


        <AddressesTable
          addresses={userPortfolioSummary?.addresses}
          loading={loaders.userPortfolioSummary}
          onUpdateAddress={handleUpdateAddress}
          onReorderAddress={onDragEnd}
          onDeleteAddress={handleDeleteUserAddress}
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

export default DashboardUserWallets;
