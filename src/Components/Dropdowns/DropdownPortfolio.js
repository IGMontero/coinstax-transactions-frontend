import React, { useEffect, useRef, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import {
  copyToClipboard,
  CurrencyUSD,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../utils/utils';
import DropdownMenuPortal from './DropdownPortal';
import { Link, useParams } from 'react-router-dom';
import {
  deleteUserAddressWallet,
  getPortfolioWallets,
  getUserWallets,
  updateUserWalletAddress,
} from '../../slices/userWallets/thunk';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { DASHBOARD_USER_ROLES } from '../../common/constants';
import Skeleton from 'react-loading-skeleton';
import { layoutModeTypes } from '../constants/layout';
import Swal from 'sweetalert2';

const DropdownPortfolio = ({ dropdownOpen, toggleDropdown, isInHeader }) => {
  const dispatch = useDispatch();
  const fetchInterval = useRef(null);
  const { address } = useParams();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { userPortfolio } = useSelector((state) => state.userWallets);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const isUserOrNoUser = user?.role === DASHBOARD_USER_ROLES.USER || !user;
  const isAdminOrAccountant =
    user?.role === DASHBOARD_USER_ROLES.ADMIN ||
    user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;

  const [loadingWallets, setLoadingWallets] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addressesValues, setAddressesValues] = useState({});

  const [initialLoad, setInitialLoad] = useState(true);

  const [subDropdownOpen, setSubDropdownOpen] = useState(null);

  const [prevAddress, setPrevAddress] = useState('');

  const fetchUserWallets = async () => {
    setLoadingWallets(true);
    try {
      await dispatch(getUserWallets(userId)).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingWallets(false);
    }
  };

  const fetchPortfolioWallets = async () => {
    setLoadingPortfolio(true);
    try {
      const response = await dispatch(getPortfolioWallets(userId)).unwrap();
      if (response && !response.error) {
        setTotalValue(response.blockchains?.all?.totalValue);
        setAddressesValues(response.addressesValues || {});
        if (response.complete && fetchInterval.current) {
          setLoadingPortfolio(false);
          clearInterval(fetchInterval.current);
          fetchInterval.current = null;
        }
      }
    } catch (error) {
      console.log(error);
      setLoadingPortfolio(false);
    }
  };

  useEffect(() => {
    const initializeFetch = async () => {
      await fetchPortfolioWallets();
      await fetchUserWallets();
      setInitialLoad(false);
    };

    if (initialLoad) {
      initializeFetch();
      fetchInterval.current = setInterval(() => {
        fetchPortfolioWallets();
      }, 2000);
    }

    return () => {
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
      }
    };
  }, [address, initialLoad, userId, userPortfolio]);

  useEffect(() => {
    if (address) {
      const matchingAddress = userPortfolio.find(
        (wallet) => wallet.Address === address,
      );
      setSelectedAddress(matchingAddress || null);
    } else if (!address && prevAddress) {
      setSelectedAddress(
        userPortfolio.find((wallet) => wallet.Address === prevAddress) || null,
      );
    }
  }, [address, userPortfolio, prevAddress]);

  const handleSelectAddress = (address) => {
    setPrevAddress(address.Address);
    setSelectedAddress(address);
    toggleDropdown();
  };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      inputValue: address.Name,
      html: `
      <span class="fs-6 align-items-start border rounded bg-light" >${address.Address}</span>
    `,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (
          userPortfolio.some(
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
              userId,
              name: newName,
              addressId: address.Id,
            }),
          ).unwrap();

          if (response && !response.error) {
            // Swal.fire({
            //   title: 'Success',
            //   text: 'Wallet address updated successfully',
            //   icon: 'success',
            // });

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
            deleteUserAddressWallet({ userId, addressId: address.Id }),
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

  const renderOptionsSubDropdown = (index, address) => {
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
            onClick={(e) => handleCopy(e, address.Address)}
          >
            <i className="ri-file-copy-line me-2"></i> Copy Address
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={(e) => handleUpdateAddress(e, address)}
          >
            <i className="ri-edit-line me-2"></i> Rename
          </DropdownItem>
          <DropdownItem
            className="d-flex align-items-center"
            onClick={() => handleDeleteUserAddress(address)}
          >
            <i className="ri-delete-bin-line me-2"></i> Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  const getValueForAddress = (address) => {
    return addressesValues[address]
      ? parseValuesToLocale(addressesValues[address], CurrencyUSD)
      : '$ 0';
  };

  return (
    <Dropdown className="ms-2" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle
        className={`w-100 bg-transparent ${isInHeader ? 'py-1 ' : ''} border-2 border-light rounded-4  d-flex align-items-center`}
        variant="transparent"
        id="dropdown-basic"
      >
        {!isInHeader && (
          <i className="ri-dashboard-fill pe-3 fs-2 text-dark"></i>
        )}
        <div className="d-flex flex-column align-items-start flex-grow-1">
          <span className={`text-start text-dark ${isInHeader ? 'me-2' : ''}`}>
            {selectedAddress
              ? selectedAddress.Name
                ? selectedAddress.Name
                : formatIdTransaction(selectedAddress.Address, 3, 6)
              : 'Portfolio'}
          </span>
          {!isInHeader && (
            <div className="text-start text-muted">
              {selectedAddress
                ? getValueForAddress(selectedAddress.Address)
                : parseValuesToLocale(totalValue, CurrencyUSD)}
            </div>
          )}
        </div>
        <i className="ri-arrow-down-s-line fs-4"></i>
      </DropdownToggle>

      <DropdownMenuPortal>
        <DropdownMenu
          className={isInHeader ? '' : 'ms-5'}
          style={{ zIndex: 1002 }}
        >
          {!userPortfolio.length ? null : (
            <>
              <DropdownItem className="d-flex align-items-center">
                <Link
                  to={process.env.PUBLIC_URL + '/portfolio'}
                  className="dropdown-item ps-0"
                  onClick={() => handleSelectAddress(null)}
                >
                  <div className="d-flex align-items-center">
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
                          parseValuesToLocale(totalValue, CurrencyUSD)
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </DropdownItem>
              <div className="dropdown-divider"></div>
            </>
          )}
          {userPortfolio &&
            userPortfolio.map((address, index) => (
              <>
                <DropdownItem
                  className="d-flex align-items-center"
                  key={index}
                  onClick={() => handleSelectAddress(address)}
                >
                  <Link
                    to={process.env.PUBLIC_URL + `/address/${address.Address}`}
                    className="dropdown-item ps-0"
                  >
                    <div className="d-flex align-items-center">
                      <i className="ri-link text-muted fs-3 align-middle me-3"></i>
                      <div className="d-flex flex-column">
                        <span className="align-middle">
                          {loadingWallets ? (
                            <Skeleton
                              width={80}
                              baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                              highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
                            />
                          ) : address.Name ? (
                            address.Name
                          ) : (
                            formatIdTransaction(address.Address, 3, 6)
                          )}
                        </span>
                        {loadingWallets ? (
                          <Skeleton
                            width={60}
                            baseColor={isDarkMode ? '#333' : '#f3f3f3'}
                            highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
                          />
                        ) : (
                          <span className="text-muted">
                            {getValueForAddress(address.Address)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {selectedAddress &&
                    selectedAddress.Address === address.Address && (
                      <i className="ri-check-line text-muted fs-16 align-middle me-3"></i>
                    )}
                  {renderOptionsSubDropdown(index, address)}
                </DropdownItem>
              </>
            ))}
          {userPortfolio.length > 0 && <div className="dropdown-divider"></div>}
          <DropdownItem>
            <Link
              to={process.env.PUBLIC_URL + '/wallets/connect'}
              className="dropdown-item ps-0"
            >
              <i className="ri-add-line text-muted fs-16 align-middle me-3"></i>
              <span className="align-middle">Connect another Wallet</span>
            </Link>
          </DropdownItem>
          <DropdownItem href="#/action-2">
            {user && (
              <DropdownItem className="p-0">
                <Link
                  to={
                    process.env.PUBLIC_URL +
                    (isUserOrNoUser ? '/wallets' : '/clients')
                  }
                  className="dropdown-item ps-0"
                >
                  <i className="mdi mdi-wallet text-muted fs-16 align-middle me-3"></i>
                  <span className="align-middle">
                    Manage {isAdminOrAccountant ? 'Clients' : 'Wallets'}
                  </span>
                </Link>
              </DropdownItem>
            )}
          </DropdownItem>
        </DropdownMenu>
      </DropdownMenuPortal>
    </Dropdown>
  );
};

export default DropdownPortfolio;
