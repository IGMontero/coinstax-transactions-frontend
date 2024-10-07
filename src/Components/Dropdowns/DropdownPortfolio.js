import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { useRefreshUserPortfolio } from '../../hooks/useUserPortfolio';
import {
  deleteUserAddressWallet,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import {
  CurrencyUSD,
  copyToClipboard,
  formatAddressToShortVersion,
  parseValuesToLocale,
} from '../../utils/utils';
import { layoutModeTypes } from '../constants/layout';
import DropdownMenuPortal from './DropdownPortal';
import { getUserSavedAddresses } from '../../helpers/cookies_helper';
import { setAddressName } from '../../slices/addressName/reducer';

const DropdownPortfolio = ({ dropdownOpen, toggleDropdown, isInHeader }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { address, userId } = useParams();
  const addressParams = address?.toLowerCase();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const addresses = useSelector((state) => state.addressName.addresses);

  const refreshUserPortfolio = useRefreshUserPortfolio();

  const { userPortfolioSummary, loaders } = useSelector(
    (state) => state.userWallets,
  );

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const userPortfolioAddresses = useMemo(
    () => userPortfolioSummary?.addresses || [],
    [userPortfolioSummary],
  );
  const [selectedAddress, setSelectedAddress] = useState(
    userPortfolioAddresses.find((addr) => addr.address === addressParams) ||
    null,
  );

  const [subDropdownOpen, setSubDropdownOpen] = useState(null);

  const [prevAddress, setPrevAddress] = useState('');

  const totalPortfolioValue =
    userPortfolioSummary?.blockchains?.all?.totalValue || 0;
  const loadingPortfolio = loaders?.userPortfolioSummary;

  useEffect(() => {
    if (addressParams) {
      const matchedAddress = userPortfolioAddresses.find(
        (addr) => addr.address === addressParams,
      );
      if (matchedAddress) {
        setSelectedAddress(matchedAddress);
        setPrevAddress(matchedAddress.address);
      }
    }
  }, [addressParams, userPortfolioAddresses, selectedAddress]);

  const handleSelectAddress = (address) => {
    if (address === 'portfolio') {
      setSelectedAddress(`portfolio`);
    } else {
      const selected = userPortfolioAddresses.find(
        (addr) => addr.address === address,
      );
      setPrevAddress(selected.address);
      setSelectedAddress(selected);
    }
    toggleDropdown();
  };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      inputValue: address.name,
      html: `
      <span class="fs-6 align-items-start border rounded bg-light" >${address.address}</span>
    `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        // if (
        //   userPortfolio.some(
        //     (addr) => addr.Name === value && addr.Address !== address.Address,
        //   )
        // ) {
        //   return 'This name already exists!';
        // }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : null;

        try {
          const response = await dispatch(
            updateUserWalletAddress({
              userId: currentUserId,
              name: newName,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            // Swal.fire({
            //   title: 'Success',
            //   text: 'Wallet address updated successfully',
            //   icon: 'success',
            // });
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

  const handleDeleteUserAddress = (address) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure to delete wallet ${address.name ? address.name : address.address
        }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({
              userId: currentUserId,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });
            refreshUserPortfolio();
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

  const handleCopy = (e, text) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(text);
    // Swal.fire({
    //   text: 'Address copied to clipboard!',
    //   icon: 'success',
    //   timer: 2000,
    //   showConfirmButton: false,
    // });
  };

  const toggleSubDropdown = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (subDropdownOpen === index) {
      setSubDropdownOpen(null);
    } else {
      setSubDropdownOpen(index);
    }
  };

  const renderOptionsSubDropdown = (index, addressData) => {
    const { address } = addressData;

    return (
      <Dropdown
        isOpen={subDropdownOpen === index}
        toggle={(e) => {
          toggleSubDropdown(e, index);
        }}
        direction="right"
      >
        <DropdownToggle
          caret={false}
          className="btn btn-light btn-sm text-muted"
          onClick={(e) => {
            toggleSubDropdown(e, index);
          }}
        >
          <i className="ri-more-2-fill"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={(e) => handleCopy(e, address)}
          >
            <i className="ri-file-copy-line me-2"></i> Copy Address
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={(e) => handleUpdateAddress(e, addressData)}
          >
            <i className="ri-edit-line me-2"></i> Rename
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleDeleteUserAddress(addressData)}
          >
            <i className="ri-delete-bin-line me-2"></i> Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  // const getValueForAddress = (address) => {
  //   const addressValue = userPortfolioSummary?.addressesValues?.[address];

  //   console.log('addressValue', addressValue);

  //   return addressValue
  //     ? parseValuesToLocale(addressValue, CurrencyUSD)
  //     : '$ 0';
  // };

  const handleVisitAddress = (link) => {
    navigate(`${link}`);
  };

  const renderPortfolioAddress = (addressData, index) => {
    const { address, value, complete } = addressData;
    const addressValue = value ? parseValuesToLocale(value, CurrencyUSD) : '$0';
    const loadingAddressValue = !complete;
    const isSelected =
      selectedAddress?.address?.toLowerCase() === address?.toLowerCase() ||
      addressParams === address;

    const customName = addresses?.find((addr) => addr.value?.toLowerCase() === address?.toLowerCase())?.label

    return (
      <>
        <DropdownItem
          className="d-flex align-items-center "
          key={address}
          onClick={() => {
            handleSelectAddress(address);
            handleVisitAddress(`/address/${address}`);
          }}
        >
          <div className="d-flex align-items-center dropdown-item ps-0">
            <i className="ri-link text-muted fs-3 align-middle me-3"></i>
            <div className="d-flex flex-column">
              <span className="align-middle">
                {customName || formatAddressToShortVersion(address)}
              </span>
              {loadingAddressValue ? (
                <Skeleton
                  width={60}
                  baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                  highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
                />
              ) : (
                <span className="text-muted">{addressValue}</span>
              )}
            </div>
          </div>

          {isSelected ? (
            <i className="ri-check-line text-muted fs-16 align-middle me-3"></i>
          ) : null}
          {renderOptionsSubDropdown(index, addressData)}
        </DropdownItem>
      </>
    );
  };

  const getDisplayTextDropdown = () => {
    if (selectedAddress) {
      const selectedAddressCustomName = addresses?.find(
        (addr) => addr.value?.toLowerCase() === selectedAddress.address?.toLowerCase(),
      )?.label

      if (selectedAddressCustomName) {
        return selectedAddressCustomName;
      }

      if (selectedAddress.name) {
        return selectedAddress.name;
      }
      if (selectedAddress.address) {
        return formatAddressToShortVersion(selectedAddress.address);
      }
      if (selectedAddress === 'portfolio' && !userId) {
        return 'Portfolio';
      }
    }
    return userId ? 'User Portfolio' : 'Select Wallet';
  };

  return (
    <Dropdown className="ms-2" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle
        className={`w-100 bg-transparent ${isInHeader ? 'py-1 ' : ''
          } border-1 border-light rounded-4  d-flex align-items-center`}
        variant="transparent"
        id="dropdown-basic"
      >
        {!isInHeader && (
          <i className="ri-dashboard-fill pe-3 fs-2 text-dark"></i>
        )}
        <div className="d-flex flex-column align-items-start flex-grow-1">
          <span className={`text-start text-dark ${isInHeader ? 'me-2' : ''}`}>
            {getDisplayTextDropdown()}
          </span>

          <div className="text-start text-muted">
            {!selectedAddress || userId ? null : loadingPortfolio ? (
              <Skeleton
                width={80}
                baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
              />
            ) : selectedAddress === 'portfolio' ? (
              parseValuesToLocale(totalPortfolioValue, CurrencyUSD)
            ) : (
              parseValuesToLocale(selectedAddress.value, CurrencyUSD)
            )}
            {/* {selectedAddress ? (
              parseValuesToLocale(selectedAddress.value, CurrencyUSD)
            ) : loadingPortfolio ? (
              <Skeleton
                width={80}
                baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
              />
            ) 
            : userId ? null : (
              parseValuesToLocale(totalPortfolioValue, CurrencyUSD)
            )} */}
          </div>
        </div>
        <i className="ri-arrow-down-s-line fs-4 text-dark"></i>
      </DropdownToggle>

      <DropdownMenuPortal>
        <DropdownMenu
          className={isInHeader ? '' : 'ms-5'}
          style={{
            zIndex: 1004,
            width: '300px',
          }}
        >
          {!userPortfolioAddresses.length ? null : (
            <>
              <DropdownItem
                onClick={() => {
                  handleSelectAddress('portfolio');
                  handleVisitAddress('/portfolio');
                }}
                className="d-flex align-items-center"
              >
                <div className="d-flex align-items-center dropdown-item ps-0">
                  <i className="ri-dashboard-fill text-muted fs-3 align-middle me-3"></i>
                  <div className="d-flex flex-column">
                    <span className="align-middle">Portfolio</span>
                    <span className="text-muted">
                      {loadingPortfolio ? (
                        <Skeleton
                          width={80}
                          baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                          highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
                        />
                      ) : (
                        parseValuesToLocale(totalPortfolioValue, CurrencyUSD)
                      )}
                    </span>
                  </div>
                </div>
              </DropdownItem>
              <div className="dropdown-divider"></div>
            </>
          )}
          {userPortfolioAddresses?.map((address, index) =>
            renderPortfolioAddress(address, index),
          )}
          {userPortfolioAddresses.length > 0 && (
            <div className="dropdown-divider"></div>
          )}
          <DropdownItem
            onClick={() => {
              handleVisitAddress('/wallets');
            }}
          >
            <div className="dropdown-item ps-0">
              <i className="ri-add-line text-muted fs-16 align-middle me-3"></i>
              <span className="align-middle">Connect another Wallet</span>
            </div>
          </DropdownItem>

          {user && (
            <DropdownItem
              onClick={() => {
                handleVisitAddress('/wallets');
              }}
            >
              <div className="dropdown-item ps-0">
                <i className="mdi mdi-wallet text-muted fs-16 align-middle me-3"></i>
                <span className="align-middle">Manage Wallets</span>
              </div>
            </DropdownItem>
          )}
        </DropdownMenu>
      </DropdownMenuPortal>
    </Dropdown>
  );
};

export default DropdownPortfolio;
