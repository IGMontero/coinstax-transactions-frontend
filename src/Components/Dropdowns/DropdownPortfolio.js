import React, { useEffect, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import {
  CurrencyUSD,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../utils/utils';
import DropdownMenuPortal from './DropdownPortal';
import { Link, useParams } from 'react-router-dom';
import {
  getPortfolioWallets,
  getUserWallets,
} from '../../slices/userWallets/thunk';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { DASHBOARD_USER_ROLES } from '../../common/constants';
import Skeleton from 'react-loading-skeleton';
import { layoutModeTypes } from '../constants/layout';

const DropdownPortfolio = ({ dropdownOpen, toggleDropdown }) => {
  const dispatch = useDispatch();
  const { address } = useParams();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const { userPortfolio } = useSelector((state) => state.userWallets);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const [loadingWallets, setLoadingWallets] = useState(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const isUserOrNoUser = user?.role === DASHBOARD_USER_ROLES.USER || !user;
  const isAdminOrAccountant =
    user?.role === DASHBOARD_USER_ROLES.ADMIN ||
    user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;

  const fetchUserWallets = async () => {
    setLoadingWallets(true);
    try {
      await dispatch(getUserWallets(userId)).unwrap();
      setLoadingWallets(false);
    } catch (error) {
      console.log(error);
      setLoadingWallets(false);
    }
  };

  const fetchPortfolioWallets = async () => {
    setLoadingPortfolio(true);
    try {
      const response = await dispatch(getPortfolioWallets(userId)).unwrap();
      if (response && !response.error) {
        setTotalValue(response.blockchains?.all?.totalValue);
      }
      setLoadingPortfolio(false);
    } catch (error) {
      console.log(error);
      setLoadingPortfolio(false);
    }
  };

  useEffect(() => {
    fetchPortfolioWallets();
  }, []);

  useEffect(() => {
    fetchUserWallets();
  }, [address]);

  useEffect(() => {
    if (userPortfolio.length > 0) {
      if (address) {
        const selected = userPortfolio.find(
          (wallet) => wallet.Address === address,
        );
        setSelectedAddress(selected || null);
      } else {
        setSelectedAddress(null);
      }
    }
  }, [address, userPortfolio]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    toggleDropdown();
  };

  return (
    <Dropdown className="ms-2" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle
        className="w-100 bg-transparent border-2 border-light rounded-4 d-flex align-items-center"
        variant="transparent"
        id="dropdown-basic"
      >
        <i className="ri-dashboard-fill pe-3 fs-2"></i>
        <div className="d-flex flex-column align-items-start flex-grow-1">
          <span className="text-start">
            {selectedAddress
              ? selectedAddress.Name
                ? selectedAddress.Name
                : formatIdTransaction(selectedAddress.Address, 3, 6)
              : 'Portfolio'}
          </span>
          <div className="text-start text-muted">
            {selectedAddress
              ? '$123'
              : parseValuesToLocale(totalValue, CurrencyUSD)}
          </div>
        </div>
        <i className="ri-arrow-down-s-line fs-4"></i>
      </DropdownToggle>

      <DropdownMenuPortal>
        <DropdownMenu className="ms-5" style={{ zIndex: 1002 }}>
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
          {userPortfolio &&
            userPortfolio.map((address, index) => (
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
                        address.Name && (
                          <span className="text-muted">
                            {formatIdTransaction(address.Address, 3, 6)}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </Link>
              </DropdownItem>
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
