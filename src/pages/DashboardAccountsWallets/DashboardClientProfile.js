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
  getUserWallets,
  reorderUserWallets,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';

const DashboardClientProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { clientId } = useParams();

  const [client, setClient] = useState(null);
  const [modalConnectWallet, setModalConnectWallet] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [addresses, setAddresses] = useState([]);

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

  // const fetchUserWallets = async () => {
  //   console.log('fetching user wallets');
  //   setLoadingWallets(true);
  //   try {
  //     const response = await dispatch(
  //       getClientUserPortfolioSummary({ userId: client.UserId }),
  //     ).unwrap();
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoadingWallets(false);
  //   }
  // };

  const fetchUserWallets = async () => {
    setLoadingWallets(true);
    try {
      const response = await dispatch(getUserWallets(client.UserId));
      console.log(response);

      setAddresses(response.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWallets(false);
    }
  };

  useEffect(() => {
    if (client) {
      fetchUserWallets();
    }
  }, [client]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(addresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      Index: idx + 1,
    }));

    setAddresses(updatedItems);

    await handleReorderAddresses(updatedItems);
  };

  const handleReorderAddresses = async (updatedAddresses) => {
    const payload = updatedAddresses.map((address) => ({
      Id: address.Id,
      Index: address.Index,
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
      inputValue: address.Name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        // Correcting the validation logic
        if (
          addresses.some(
            (addr) => addr.Name === value && addr.Address !== address.Address,
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
              addressId: address.Id,
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
      text: `Are you sure to delete wallet ${address.Name ? address.Name : address.Address}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({
              userId: client.UserId,
              addressId: address.Id,
            }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });

            setAddresses(addresses.filter((addr) => addr.Id !== address.Id));
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
        <AddressesTable
          userId={client?.UserId}
          modalConnectWallet={modalConnectWallet}
          setModalConnectWallet={setModalConnectWallet}
          addresses={addresses}
          loading={loadingWallets}
          onRefresh={fetchUserWallets}
          onDeleteAddress={handleDeleteUserAddress}
          onReorderAddress={onDragEnd}
          onUpdateAddress={handleUpdateAddress}
        />
      </div>
    </React.Fragment>
  );
};

export default DashboardClientProfile;
