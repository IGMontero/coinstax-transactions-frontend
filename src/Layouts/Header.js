import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  InputGroup,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';

//import images
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../assets/images/logo-light.png';
import logoSm from '../assets/images/logo-sm.png';

import logo from '../assets/images/logos/logo-dark.png';
//import Components
import LightDark from '../Components/Common/LightDark';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import SearchOption from '../Components/Common/SearchOption';

import { useDispatch, useSelector } from 'react-redux';
import { changeSidebarVisibility } from '../slices/thunks';
import { layoutModeTypes } from '../Components/constants/layout';
import ParentComponentSearchBar from '../Components/SearchBar/ParentComponent';
import WalletDropdown from '../Components/Common/WalletDropdown';
import { DASHBOARD_USER_ROLES } from '../common/constants';
import DropdownPortfolio from '../Components/Dropdowns/DropdownPortfolio';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState('');
  const { user } = useSelector((state) => state.auth);

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const isLightMode = layoutModeType === layoutModeTypes['LIGHTMODE'];

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
        {/* <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown> */}

        {/* <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              /> */}

        {/* NotificationDropdown */}
        {/* <NotificationDropdown /> */}
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        style={{
          width: '100%',
          left: 0,
        }}
        className="mb-4 d-flex align-items-center justify-content-center"
      >
        <div
          className="header-container"
          style={{
            width: '100%',
            maxWidth: '960px',
          }}
        >
          <Row
            className={`navbar-header `}
            style={{
              backgroundColor:
                layoutModeType === layoutModeTypes['DARKMODE']
                  ? '#16161a'
                  : '#fff',
              // borderBottom:
              //   layoutModeType === layoutModeTypes['DARKMODE']
              //     ? ' rgba(255, 255, 255, 0.04)'
              //     : ' rgba(0, 0, 0, 0.04)',
            }}
          >
            <Col
              lg={12}
              xs={12}
              className="d-flex justify-content-between align-items-center"
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
              <Col className="d-flex align-items-center  ms-lg-4  ms-md-4  ms-1  col-8">
                <div className="col-sm-12 col-md-12 col-lg-7 col-xs-12 col-12 ">
                  <ParentComponentSearchBar />
                </div>
              </Col>
              <Col lg={3}>
                <div className="d-flex align-items-center justify-content-end">
                  <LightDark
                    layoutMode={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode}
                  />
                  {/* {commentedCode()} */}

                  {/* {currentUser &&
                    currentUser?.role === DASHBOARD_USER_ROLES.USER && (
                    
                      <div className="me-2">
                        <DropdownPortfolio
                          dropdownOpen={dropdownOpen}
                          toggleDropdown={toggleDropdown}
                          isInHeader={true}
                        />
                      </div>
                    )} */}
                  {currentUser ? (
                    <ProfileDropdown currentUser={currentUser} />
                  ) : (
                    <Link to={'/login'}>
                      <ProfileDropdown />
                    </Link>
                  )}
                </div>
              </Col>
            </Col>
          </Row>

          <div className="border-bottom border-2 mx-5 d-flex justify-content-center"></div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
