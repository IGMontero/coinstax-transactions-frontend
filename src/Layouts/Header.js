import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  Nav,
  NavItem,
  Row,
} from 'reactstrap';

//import images
//import Components
import LightDark from '../Components/Common/LightDark';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';

import { useDispatch, useSelector } from 'react-redux';
import WalletsConnectDropdown from '../Components/Common/WalletsConnectDropdown';
import { layoutModeTypes } from '../Components/constants/layout';
import ParentComponentSearchBar from '../Components/SearchBar/ParentComponent';
import { setNotificationsInfo } from '../slices/notifications/reducer';
import { fetchNotifications } from '../slices/notifications/thunk';
import { changeSidebarVisibility } from '../slices/thunks';
import CollapseMenuHeader from '../Components/Dropdowns/CollapseMenuHeader';
import { useLogOut } from '../hooks/useAuth';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogOut();
  const notifications = useSelector(
    (state) => state.notifications.notifications,
  );

  const [currentPageNotifications, setCurrentPageNotifications] = useState(0);

  const [searchInput, setSearchInput] = useState('');
  const { user } = useSelector((state) => state.auth);

  const [isOpenCollapseMenuHeader, setIsOpenCollapseMenuHeader] =
    useState(false);

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [initializedNotifications, setInitializedNotifications] =
    useState(false);

  const isLightMode = layoutModeType === layoutModeTypes['LIGHTMODE'];

  const backgroundColor =
    layoutModeType === layoutModeTypes['DARKMODE'] ? '#16161a' : '#fff';

  const currentUser = user;
  const { sidebarVisibilitytype } = useSelector((state) => ({
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype,
  }));

  const [search, setSearch] = useState(false);

  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    if (windowSize > 767) {
      return;
    }
    dispatch(changeSidebarVisibility('show'));

    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      document.body?.classList?.contains('menu')
        ? document.body?.classList?.remove('menu')
        : document.body?.classList?.add('menu');
    }

    if (
      sidebarVisibilitytype === 'show' &&
      (document.documentElement.getAttribute('data-layout') === 'vertical' ||
        document.documentElement.getAttribute('data-layout') === 'semibox')
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body?.classList?.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? document.documentElement.setAttribute('data-sidebar-size', '')
          : document.documentElement.setAttribute('data-sidebar-size', 'sm');
      } else if (windowSize > 1025) {
        document.body?.classList?.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'lg'
          ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
          : document.documentElement.setAttribute('data-sidebar-size', 'lg');
      } else if (windowSize <= 767) {
        document.body?.classList?.add('vertical-sidebar-enable');
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      document.body?.classList?.contains('twocolumn-panel')
        ? document.body?.classList?.remove('twocolumn-panel')
        : document.body?.classList?.add('twocolumn-panel');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    // Escucha los cambios de tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpieza del evento
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSearchInput('');
  }, [location]);

  const commentedCode = () => {
    return (
      <>
        <Dropdown
          isOpen={search}
          toggle={toogleSearch}
          className="d-md-none topbar-head-dropdown header-item"
        >
          <DropdownToggle
            type="button"
            tag="button"
            className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
          >
            <i className="bx bx-search fs-22"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
            <Form className="p-3">
              <div className="form-group m-0">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search ..."
                    aria-label="Recipient's username"
                  />
                  <button className="btn btn-primary" type="submit">
                    <i className="mdi mdi-magnify"></i>
                  </button>
                </div>
              </div>
            </Form>
          </DropdownMenu>
        </Dropdown>

        <LightDark
          layoutMode={layoutModeType}
          onChangeLayoutMode={onChangeLayoutMode}
        />

        {/* <div>
                <Button
                  onClick={() => navigate('/')}
                  className="bg bg-transparent  border-0 btn btn-transparent"
                >
                  <i className="bx bx-world fs-3"></i>
                </Button>
              </div> */}
        {/* <div className="">
                <Link to="/" className="log">
                  <span className="logo-lg">
                    <img src={logo} alt="" height="30" />
                  </span>
                </Link>
              </div> */}

        {/* ProfileDropdown */}
      </>
    );
  };

  const handleGetNotifications = async () => {
    try {
      const response = await dispatch(
        fetchNotifications({ page: currentPageNotifications }),
      );
      const res = response.payload;
      if (res && !response.error) {
        const newNotifications = res.notifications;

        dispatch(
          setNotificationsInfo({
            hasMore: res.hasMore,
            unreadCount: res.unreadCount,
            total: res.total,
            notifications: newNotifications,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMoreNotifications = async () => {
    try {
      const response = await dispatch(
        fetchNotifications({ page: currentPageNotifications + 1 }),
      );
      const res = response.payload;
      if (res && !response.error) {
        const newNotifications = [...notifications, ...res.notifications];

        // Remove duplicates
        const uniqueNotifications = newNotifications.filter(
          (notification, index, self) =>
            index === self.findIndex((t) => t.id === notification.id),
        );

        // Sort by createdAt
        uniqueNotifications.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        dispatch(
          setNotificationsInfo({
            hasMore: res.hasMore,
            unreadCount: res.unreadCount,
            total: res.total,
            notifications: uniqueNotifications,
          }),
        );

        setCurrentPageNotifications(currentPageNotifications + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      navigate('/wallets');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && !initializedNotifications) {
      setInitializedNotifications(true);
      handleGetNotifications();
    }
  }, [currentUser]);

  const isMobile = windowSize < 769;

  useEffect(() => {
    if (!isMobile) {
      setIsOpenCollapseMenuHeader(false);
    }
  }, [isMobile]);

  const renderButtonsAuth = () => {
    return (
      <div className="d-flex align-items-center ">
        <Button
          color="transparent"
          size="md"
          className="text-dark "
          style={{
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate('/login')}
        >
          Sign in
        </Button>
        <Button
          color="primary"
          size="md"
          className="ms-2 btn btn-primary"
          style={{
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate('/register')}
        >
          Sing Up
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        style={{
          left: '0',
          right: '0',
        }}
        className="mb-4 d-flex align-items-center justify-content-center"
      >
        <div className="container-xxl">
          <div className="row">
            <div className="col-md-2 col-lg-2 col-0"></div>

            <div
              className={`col-md-10 col-lg-8 col-12`}
              style={{
                backgroundColor: backgroundColor,
              }}
            >
              <div
                className={`d-flex justify-content-between align-items-center ${isOpenCollapseMenuHeader ? '' : 'border-bottom border-2'} w-100`}
              >
                <Col className="col-1 d-md-none d-lg-none">
                  <button
                    onClick={toogleMenuBtn}
                    type="button"
                    className="btn ms-n3 btn-sfs-16 header-item vertical-menu-btn topnav-hamburger d-block d-md-none"
                    id="topnav-hamburger-icon"
                  >
                    <span className="hamburger-icon text-dark">
                      <span
                        style={{ background: isLightMode ? 'black' : '' }}
                      ></span>
                      <span
                        style={{ background: isLightMode ? 'black' : '' }}
                      ></span>
                      <span
                        style={{ background: isLightMode ? 'black' : '' }}
                      ></span>
                    </span>
                  </button>
                </Col>
                <Col className="d-flex align-items-center col-xs-4">
                  <div className="col-sm-12 col-md-12 col-lg-7 col-xs-12 col-12 ">
                    <ParentComponentSearchBar
                      trackWallets={false}
                      searchInput={searchInput}
                      setSearchInput={setSearchInput}
                    />
                  </div>
                </Col>

                <Col lg={3}>
                  <div className="d-flex align-items-center justify-content-end">
                    {isMobile ? (
                      <>
                        <CollapseMenuHeader
                          isOpen={isOpenCollapseMenuHeader}
                          setIsOpen={setIsOpenCollapseMenuHeader}
                        />
                      </>
                    ) : (
                      <>
                        {currentUser && (
                          <NotificationDropdown
                            onRefresh={handleGetNotifications}
                            handleLoadMoreNotifications={
                              handleLoadMoreNotifications
                            }
                          />
                        )}
                        <WalletsConnectDropdown />
                        <LightDark
                          layoutMode={layoutModeType}
                          onChangeLayoutMode={onChangeLayoutMode}
                        />
                        {currentUser ? (
                          <ProfileDropdown currentUser={currentUser} />
                        ) : (
                          // <Link to={'/login'}>
                          //   <ProfileDropdown />
                          // </Link>
                          renderButtonsAuth()
                        )}
                      </>
                    )}
                  </div>
                </Col>
              </div>
              {/* CollapseMenuHeader */}
              {isOpenCollapseMenuHeader && (
                <Col>
                  <Collapse
                    isOpen={isOpenCollapseMenuHeader}
                    className="pb-3 px-3 border-bottom border-2 d-flex align-items-center"
                    style={{
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <Nav horizontal className="d-flex align-items-center">
                      {currentUser && (
                        <NavItem>
                          <NotificationDropdown
                            onRefresh={handleGetNotifications}
                            handleLoadMoreNotifications={
                              handleLoadMoreNotifications
                            }
                          />
                        </NavItem>
                      )}
                      <NavItem>
                        <WalletsConnectDropdown />
                      </NavItem>
                      <NavItem>
                        <LightDark
                          layoutMode={layoutModeType}
                          onChangeLayoutMode={onChangeLayoutMode}
                        />
                      </NavItem>
                      {currentUser ? (
                        <>
                          <NavItem>
                            <ProfileDropdown
                              currentUser={currentUser}
                              setIsOpenCollapseMenuHeader={
                                setIsOpenCollapseMenuHeader
                              }
                              isOpenCollapseMenuHeader={
                                isOpenCollapseMenuHeader
                              }
                            />
                          </NavItem>
                        </>
                      ) : (
                        renderButtonsAuth()
                      )}
                    </Nav>
                  </Collapse>
                </Col>
              )}
              {/* End CollapseMenuHeader */}
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
