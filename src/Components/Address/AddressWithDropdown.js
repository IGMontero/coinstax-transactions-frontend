import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  Col
} from 'reactstrap';
import Swal from 'sweetalert2';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import { setAddressName } from '../../slices/addressName/reducer';
import {
  addUserWallet,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import QrModal from '../Modals/QrModal';
import NetworkDropdown from '../NetworkDropdown/NetworkDropdown';

const AddressWithDropdown = ({
  filteredNetworks,
  isOnlyAllNetwork,
  incompleteBlockchains,
  loading,
  addressNickName,
  isUnsupported,
}) => {
  const { address, userId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const [loadingAddWallet, setLoadingAddWallet] = useState(false);

  const refreshUserPortfolio = useRefreshUserPortfolio();

  const addresses = useSelector((state) => state.addressName.addresses);
  const { userPortfolioSummary } = useSelector((state) => state.userWallets);

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const addressInPortfolio = userPortfolioSummary?.addresses?.find(
    (addr) => addr.address?.toLowerCase() === address?.toLowerCase(),
  );

  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [formattedAddressLabel, setFormattedAddressLabel] = useState('');
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    if (!userPortfolioSummary?.addresses) return;

    const currentFormattedValue = formatIdTransaction(address, 6, 8);
    setFormattedValue(currentFormattedValue);

    let matchingAddress;

    if (user) {
      matchingAddress = userPortfolioSummary?.addresses?.find(
        (addr) => addr.address === address,
      );
    }

    if (!matchingAddress) {
      matchingAddress = addresses?.find((addr) => addr.value === address);
    }

    setFormattedAddressLabel(currentFormattedValue);
  }, [address, user, userPortfolioSummary, addresses, userId]);

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const handleCopy = async (e, text) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      copyToClipboard(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      html: `
      <span class="fs-6 align-items-start border rounded bg-light" >${address.address}</span>
    `,
      inputValue: address.name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      // inputValidator: (value) => {
      //   if (
      //     userPortfolioSummary.addresses.some(
      //       (addr) => addr.name === value && addr.address !== address.address,
      //     )
      //   ) {
      //     return 'This name already exists!';
      //   }
      // },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : '';

        try {
          const response = await dispatch(
            updateUserWalletAddress({
              userId: currentUserId,
              name: newName,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            setFormattedAddressLabel(newName || address.address);
            dispatch(
              setAddressName({ value: address.address, label: newName }),
            );
            refreshUserPortfolio();
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

  const handleAddWallet = async (address) => {
    try {
      setLoadingAddWallet(true);
      const response = await dispatch(
        addUserWallet({ address, userId: currentUserId }),
      ).unwrap();

      if (response && !response.error) {
        dispatch(setAddressName({ value: address, label: null }));
        refreshUserPortfolio();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'Failed to connect wallet',
          icon: 'error',
        });
      }
      setLoadingAddWallet(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: error || 'Failed to connect wallet',
        icon: 'error',
      });
      setLoadingAddWallet(false);
    }
  };

  const getAddressLabel = () => {
    const addressCustomName = userPortfolioSummary?.addresses?.find(
      (addr) => addr.address?.toLowerCase() === address?.toLowerCase(),
    )?.name;

    if (user && addressCustomName) {
      return addressCustomName;
    }
    if (isCurrentUserPortfolioSelected) {
      return userId ? 'User Portfolio' : 'Portfolio';
    }
    return addressNickName || address;

    // return formattedAddressLabel !== formatIdTransaction(address, 6, 8)
    //   ? formattedAddressLabel
    //   : addressNickName || formattedAddressLabel;
  };

  const isAddressInPortfolio = userPortfolioSummary?.addresses?.find(
    (addr) => addr.address?.toLowerCase() === address?.toLowerCase(),
  );

  const renderAddressWithDropdown = () => {
    return (
      <div className="d-flex align-items-center ms-n3">
        <h4 className="mb-0 ms-3 text-custom-address-dropdown">
          {getAddressLabel()}
        </h4>
        {!isCurrentUserPortfolioSelected && (
          <div className="d-flex align-items-center ms-3">


            {isCopied ? (
              <i className="ri-check-line fs-4 me-2"></i>
            ) : (
              <i
                onClick={(e) => handleCopy(e, address)}
                title="Copy Address"
                className="ri-file-copy-line fs-4 me-2 cursor-pointer"
              ></i>
            )}

            <i
              onClick={toggleQrModal}
              className="ri-qr-code-line fs-4 me-2 cursor-pointer"
              title="Show QR code"
            ></i>

            {isAddressInPortfolio && user && (
              <i
                onClick={(e) => {
                  handleUpdateAddress(e, addressInPortfolio);
                }}
                title="Rename Wallet"
                className="ri-pencil-line fs-4 me-2 cursor-pointer"
              ></i>
            )}

            {!isAddressInPortfolio && user && (
              <i
                onClick={() => {
                  if (loadingAddWallet) {
                    return;
                  } else {
                    handleAddWallet(address);
                  }
                }}
                title="Add To Wallets"
                className="bx bx-plus fs-4 me-2 cursor-pointer"
              ></i>
            )}
          </div>
        )}
      </div>

      //   {!isCurrentUserPortfolioSelected && (
      //     <UncontrolledDropdown className="card-header-dropdown">
      //       <DropdownToggle tag="a" className="text-reset" role="button">
      //         <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
      //       </DropdownToggle>
      //       <DropdownMenu className="dropdown-menu-end ms-3">
      //         <DropdownItem
      //           className="d-flex align-items-center"
      //           onClick={toggleQrModal}
      //         >
      //           <i className="ri-qr-code-line fs-4 me-2"></i>
      //           <span className="fw-normal">Show QR code</span>
      //         </DropdownItem>
      //         <DropdownItem
      //           className="d-flex align-items-center"
      //           onClick={(e) => handleCopy(e, address)}
      //         >
      //           {isCopied ? (
      //             <i className="ri-check-line fs-4 me-2"></i>
      //           ) : (
      //             <i className="ri-file-copy-line fs-4 me-2"></i>
      //           )}
      //           <span className="fw-normal">Copy Address</span>
      //         </DropdownItem>
      //         {isAddressInPortfolio && user && (
      //           <DropdownItem
      //             className="d-flex align-items-center"
      //             onClick={(e) => {
      //               const addr = userPortfolioSummary.addresses.find(
      //                 (addr) => addr.address === address,
      //               );
      //               if (user && addr) {
      //                 handleUpdateAddress(e, addr);
      //               }
      //             }}
      //           >
      //             <i className="ri-pencil-line fs-4 me-2"></i>
      //             <span className="fw-normal">Rename</span>
      //           </DropdownItem>
      //         )}
      //         {!isAddressInPortfolio && user && (
      //           <DropdownItem
      //             className="d-flex align-items-center"
      //             onClick={() => {
      //               if (loadingAddWallet) {
      //                 return;
      //               } else {
      //                 handleAddWallet(address);
      //               }
      //             }}
      //           >
      //             <i className="bx bx-plus fs-4 me-2"></i>
      //             <span className="fw-normal">Add To Wallets</span>
      //           </DropdownItem>
      //         )}
      //       </DropdownMenu>
      //     </UncontrolledDropdown>
      //   )}
      // </div>
    );
  };

  return (
    <div className="">
      <QrModal
        showQrModal={showQrModal}
        toggleQrModal={toggleQrModal}
        addressTitle={address}
      />
      <div className="mt-5">
        <Col className="col-12 d-flex justify-content-between align-items-center">
          <Col className="col-7 d-flex justify-content-start align-items-center ">
            {renderAddressWithDropdown()}
          </Col>
          <Col className="col-3 d-flex justify-content-end align-items-center ">
            {/* {loading && (
              <div className="d-flex align-items-center me-2">
                <Spinner size="md" color="primary" />
              </div>
            )} */}
            {!isOnlyAllNetwork && !isUnsupported && (
              <NetworkDropdown
                isAdminPage={false}
                filteredNetworks={filteredNetworks}
                incompleteBlockchains={incompleteBlockchains}
                loading={loading}
              />
            )}
          </Col>
        </Col>
      </div>
    </div>
  );
};

export default AddressWithDropdown;
