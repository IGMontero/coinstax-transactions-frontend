import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
//import logo
import logoSm from '../assets/images/logo-sm.png';
import logoDark from '../assets/images/logo-dark.png';
// import logoLight from '../assets/images/logo-light.png';

import logo from '../assets/images/logos/coinstax_logos/logo-dark.png';
import logoLight from '../assets/images/logos/coinstax_logos/logo-light.png';

//Import Components
import VerticalLayout from './VerticalLayouts/index';
import TwoColumnLayout from './TwoColumnLayout';
import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import HorizontalLayout from './HorizontalLayout';
import { layoutModeTypes } from '../Components/constants/layout';
import { useSelector } from 'react-redux';
import DropdownMenuPortal from '../Components/DropdownPortal';
import { DASHBOARD_USER_ROLES } from '../common/constants';
import {
  CurrencyUSD,
  formatIdTransaction,
  parseValuesToLocale,
} from '../utils/utils';
import {
  getPortfolioWallets,
  getUserWallets,
} from '../slices/userWallets/thunk';
import { useDispatch } from 'react-redux';

const Sidebar = ({ layoutType }) => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [loading, setLoading] = React.useState(false);

  const [totalValue, setTotalValue] = useState(0);

  const [addresses, setAddresses] = React.useState([]);

  const isUserOrNoUser = user?.role === DASHBOARD_USER_ROLES.USER || !user;
  const isAdminOrAccountant =
    user?.role === DASHBOARD_USER_ROLES.ADMIN ||
    user?.role === DASHBOARD_USER_ROLES.ACCOUNTANT;

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const isLightMode = layoutModeType === layoutModeTypes['LIGHTMODE'];

  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName('vertical-overlay');
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener('click', function () {
        document.body?.classList?.remove('vertical-sidebar-enable');
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    if (
      document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover'
    ) {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        'sm-hover-active',
      );
    } else if (
      document.documentElement.getAttribute('data-sidebar-size') ===
      'sm-hover-active'
    ) {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    }
  };

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const fetchUserWallets = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getUserWallets(userId)).unwrap();

      if (response && !response.error) {
        setAddresses(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchPortfolioWallets = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getPortfolioWallets(userId)).unwrap();

      if (response && !response.error) {
        setTotalValue(response.blockchains?.all?.totalValue);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const renderDropdownMenu = () => {
    return (
      <Dropdown className="ms-2" isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle
          className="w-100 bg-transparent border-2 border-light 
          rounded-4
          "
          variant="transparent"
          id="dropdown-basic"
        >
          <span className="d-flex align-items-start justify-content-center">
            <i className="ri-wallet-3-fill pe-3 fs-3"></i>
            <div className="d-flex flex-column align-items-center">
              <span>
                {address ? formatIdTransaction(address, 3, 6) : 'Portfolio'}
                <div className="text-start text-muted">{}</div>
              </span>
            </div>
            <i className="ri-arrow-down-s-fill ms-4 fs-4"></i>
          </span>
        </DropdownToggle>
        <DropdownMenuPortal>
          <DropdownMenu className="ms-5" style={{ zIndex: 1002 }}>
            <DropdownItem className="d-flex align-items-center">
              <Link
                to={process.env.PUBLIC_URL + '/portfolio'}
                className="dropdown-item ps-0"
              >
                {' '}
                <div className="d-flex align-items-center">
                  <i className="ri-dashboard-fill text-muted fs-3 align-middle me-3"></i>
                  <div className="d-flex flex-column">
                    <span className="align-middle">Porfolio</span>
                    <span className="text-muted">
                      {parseValuesToLocale(totalValue, CurrencyUSD)}
                    </span>
                  </div>
                </div>
              </Link>
            </DropdownItem>
            <div className="dropdown-divider"></div>
            {addresses &&
              addresses?.map((address, index) => (
                <DropdownItem className="d-flex align-items-center" key={index}>
                  <Link
                    to={process.env.PUBLIC_URL + `/address/${address.Address}`}
                    className="dropdown-item ps-0"
                  >
                    <div className="d-flex align-items-center">
                      <i className="ri-link text-muted fs-3 align-middle me-3"></i>
                      <div className="d-flex flex-column">
                        <span className="align-middle">
                          {address.Name
                            ? address.Name
                            : formatIdTransaction(address.Address, 3, 6)}
                        </span>
                        {address.Name && (
                          <span className="text-muted">
                            {formatIdTransaction(address.Address, 3, 6)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </DropdownItem>
              ))}
            {addresses.length > 0 && <div className="dropdown-divider"></div>}
            <DropdownItem>
              <Link
                to={process.env.PUBLIC_URL + '/wallets/connect'}
                className="dropdown-item ps-0"
              >
                <i className="ri-add-line text-muted fs-16 align-middle me-3"></i>
                <span className="align-middle">Connect another Wallet </span>
              </Link>
            </DropdownItem>
            <DropdownItem href="#/action-2">
              {' '}
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

  useEffect(() => {
    fetchPortfolioWallets();
  }, []);
  useEffect(() => {
    fetchUserWallets();
  }, [address]);
  return (
    <React.Fragment>
      <div
        className="app-menu navbar-menu"
        style={{
          backgroundColor:
            layoutModeType === layoutModeTypes['DARKMODE']
              ? '#1d1d21'
              : '#F1F2FA',
        }}
        // style={{
        //   background: '#23282C',
        // }}
      >
        <div className="navbar-brand-box ">
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === 'horizontal' ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === 'twocolumn' ? (
          <React.Fragment>
            <TwoColumnLayout />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100 ">
              <Link
                to={
                  process.env.NODE_ENV === 'development'
                    ? '/'
                    : 'https://chainglance.com/'
                }
              >
                <span className="logo-lg d-flex align-items-center justify-content-center">
                  <img
                    src={isLightMode ? logoLight : logo}
                    alt=""
                    className="pt-2"
                    style={{
                      marginBottom: '0.85rem',
                    }}
                    height="auto"
                    width="100"
                  />
                </span>
                {/* // dropdwpn  */}
              </Link>
              {user && address && renderDropdownMenu()}
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
