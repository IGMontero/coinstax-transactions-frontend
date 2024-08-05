import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'reactstrap';
import Helmet from '../../Components/Helmet/Helmet';
import AddressesTable from './components/tables/AddressesTable';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getInfoClientByAccountantId } from '../../slices/accountants/thunk';
import { useDispatch } from 'react-redux';
import ClientInfo from './components/ClientInfo';
import {
  deleteUserAddressWallet,
  getClientUserPortfolioSummary,
  reorderUserWallets,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';
import { CurrencyUSD, parseValuesToLocale } from '../../utils/utils';
import ConnectWalletModal from '../../Components/Modals/ConnectWalletModal';

const DashboardClientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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

  const [loadingWallets, setLoadingWallets] = useState(false);

  const handeGoToDashboard = () => {
    navigate('/clients');
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
      }
    } catch (error) {
      console.log(error);
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWallets(false);
    }
  };

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

  const updatePortfolioAddresses = (updatedAddresses) => {
    setClientUserPortfolio({
      ...clientUserPortfolio,
      addresses: updatedAddresses,
    });
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(addresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    updatePortfolioAddresses(updatedItems);

    await handleReorderAddresses(updatedItems);
  };

  const handleReorderAddresses = async (updatedAddresses) => {
    const payload = updatedAddresses.map((address) => ({
      Id: address.id,
      Index: address.index,
    }));

    try {
      const response = await dispatch(
        reorderUserWallets({ userId: client.UserId, addresses: payload }),
      ).unwrap();

      if (response && !response.error) {
        // fetchUserWallets();
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
        // Correcting the validation logic
        if (
          addresses.some(
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
              userId: client.UserId,
              name: newName,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            fetchUserWallets();
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
          console.log('Client:', client);

          const response = await dispatch(
            deleteUserAddressWallet({
              userId: client.UserId,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });

            fetchUserWallets();
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
            <Button
              onClick={handeGoToDashboard}
              className=" d-flex btn-hover-light  text-dark justify-content-center align-items-center ms-3"
              color="soft-light"
              style={{
                borderRadius: '10px',
                border: '.5px solid grey',
              }}
            >
              <i className="ri-arrow-left-s-line me-2"></i>
              Back To Clients
            </Button>
          </div>
        </div>
        <div className="mb-5 mt-2">
          <ClientInfo client={client} />
        </div>
        {loadingWallets ? (
          <div className="d-flex my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : addresses?.length === 0 || !addresses ? (
          <div className="d-flex my-3">
            <h5>No wallets found</h5>
          </div>
        ) : (
          <>
            {/* // toTAL POrtfolio value */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>Portfolio Value: {parsedTotalPortfolioValue}</h4>
            </div>

            <AddressesTable
              addresses={addresses}
              loading={loadingWallets}
              onDeleteAddress={handleDeleteUserAddress}
              onReorderAddress={onDragEnd}
              onUpdateAddress={handleUpdateAddress}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardClientProfile;
