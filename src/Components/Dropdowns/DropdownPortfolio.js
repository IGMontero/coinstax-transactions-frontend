import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Col,
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
  formatIdTransaction,
  parseValuesToLocale,
} from '../../utils/utils';
import { layoutModeTypes } from '../constants/layout';
import DropdownMenuPortal from './DropdownPortal';

import { setAddressName } from '../../slices/addressName/reducer';

const DropdownPortfolio = ({ dropdownOpen, toggleDropdown, isInHeader }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { address, userId } = useParams();
  const addressParams = address?.toLowerCase();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;

  const isPortoflioPage = location.pathname.includes('portfolio');

  const addresses = useSelector((state) => state.addressName.addresses);

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const shouldShowAddress = false

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
  // const [selectedAddress, setSelectedAddress] = useState(
  //   userPortfolioAddresses.find((addr) => addr.address === addressParams) ||
  //     null,
  // );

  const selectedAddress = isPortoflioPage
    ? 'portfolio'
    : userPortfolioAddresses.find((addr) => addr.address === addressParams) ||
    addressParams;

  const [subDropdownOpen, setSubDropdownOpen] = useState(null);

  const [prevAddress, setPrevAddress] = useState('');

  const totalPortfolioValue =
    userPortfolioSummary?.blockchains?.all?.totalValue || 0;
  const loadingPortfolio = loaders?.userPortfolioSummary;

  useEffect(() => {
    if (!user) {
      setPrevAddress('');
    }
    if (addressParams) {
      const matchedAddress = userPortfolioAddresses.find(
        (addr) =>
          addr.address.toLowerCase() === addressParams.toLocaleLowerCase(),
      );
      if (matchedAddress) {
        setPrevAddress(matchedAddress);
      } else {
        setPrevAddress(addressParams);
      }
    } else {
      if (isPortoflioPage) {
        setPrevAddress('portfolio');
      }
    }
  }, [addressParams, userPortfolioAddresses, selectedAddress]);

  const handleSelectAddress = () => {
    setPrevAddress(selectedAddress);
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
      // inputValidator: (value) => {
      // if (
      //   userPortfolio.some(
      //     (addr) => addr.Name === value && addr.Address !== address.Address,
      //   )
      // ) {
      //   return 'This name already exists!';
      // }
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
    const addressDisplay = address.name ? address.name : address.address;
    Swal.fire({
      // title: `Delete wallet ${addressDisplay}`,
      text: `Delete wallet ${addressDisplay}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
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

    const customName = userPortfolioSummary.addresses?.find(
      (addr) => addr.address?.toLowerCase() === address?.toLowerCase(),
    )?.name;

    return (
      <>
        <DropdownItem
          className="d-flex align-items-center "
          key={index}
          onClick={() => {
            handleSelectAddress(address);
            handleVisitAddress(`/address/${address}`);
          }}
        >
          <div className="d-flex align-items-center dropdown-item ps-0">
            <i className="ri-link text-muted fs-3 align-middle me-3"></i>
            <div className="d-flex flex-column">
              <span
                className="align-middle"
                style={{
                  maxWidth: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
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

  const addressToShow = selectedAddress || prevAddress;

  const getSelectedAddressName = (addressName) => {
    if (addressName === 'portfolio') {
      return 'Portfolio';
    }

    const address = addresses?.find(
      (addr) =>
        addr.value?.toLowerCase() === addressName.address?.toLowerCase(),
    );
    return address?.label || null;
  };

  const getDefaultAddressName = (address) => {
    if (address.name) {
      return address.name;
    }
    if (address.address) {
      return formatAddressToShortVersion(address.address);
    }
    return formatAddressToShortVersion(address);
  };

  const getDisplayTextDropdown = () => {
    if (addressToShow) {
      const selectedAddressCustomName = getSelectedAddressName(addressToShow);

      if (selectedAddressCustomName) {
        return selectedAddressCustomName;
      }

      if (addressToShow === 'portfolio' && !userId) {
        return 'Portfolio';
      }

      return getDefaultAddressName(addressToShow);
    }

    return userId ? 'User Portfolio' : 'Select Wallet';
  };

  const shouldBeResponsive = windowSize < 1126 && windowSize > 767;

  return (
    <Dropdown
      className="mt-3"
      style={{
        maxWidth: shouldBeResponsive ? '' : '150px',
      }}
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle
        className={` bg-transparent p-0  d-flex ${shouldBeResponsive ? 'ps-4 w-100' : 'ps-0'}  align-items-start justify-content-center border-0 rounded-4 `}
        variant="transparent"
        id="dropdown-basic"

      >
        <div
          className={`${shouldBeResponsive ? 'flex-column text-center' : ''}  d-flex align-items-center`}
        >
          <i
            className={`ri-dashboard-fill ${shouldBeResponsive ? '' : 'pe-3'} fs-18 text-dark`}
          ></i>

          <div className="d-flex flex-column align-items-start flex-grow-1">
            <span
              className={`text-start text-dark ${isInHeader ? 'me-2' : ''}`}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: shouldBeResponsive ? '70px' : '120px',
              }}
            >
              {getDisplayTextDropdown()}
              {/* {getDisplayTextDropdown()} */}
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
                parseValuesToLocale(addressToShow.value, CurrencyUSD)
              )}
            </div>
          </div>
        </div>
        <i className="ri-arrow-down-s-line  fs-4 text-dark"></i>
      </DropdownToggle>

      <DropdownMenuPortal>
        <DropdownMenu
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
          {/* <DropdownItem
            onClick={() => {
              handleVisitAddress('/wallets');
            }}
          >
            <div className="dropdown-item ps-0">
              <i className="ri-add-line text-muted fs-16 align-middle me-3"></i>
              <span className="align-middle">Connect another Wallet</span>
            </div>
          </DropdownItem> */}

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
        </DropdownMenu>
      </DropdownMenuPortal>
    </Dropdown>
  );
};

export default DropdownPortfolio;
