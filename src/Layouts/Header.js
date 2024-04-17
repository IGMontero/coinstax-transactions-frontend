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
import QrModal from '../pages/DashboardInfo/modals/QrModal';
import { copyToClipboard, formatIdTransaction } from '../utils/utils';
import SearchBar from '../Components/SearchBar/SearchBar';
import AddressWithDropdown from '../Components/Address/AddressWithDropdown';
import { layoutModeTypes } from '../Components/constants/layout';

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { assets, transactions, performance } = useSelector(
    (state) => state.fetchData,
  );

  const isUnsupported =
    assets.unsupported || transactions.unsupported || performance.unsupported;
  const { address } = useParams();

  const currentUser = user;

  const { sidebarVisibilitytype } = useSelector((state) => ({
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype,
  }));

  const [search, setSearch] = useState(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;

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
  {
    /* {!currentUser && (
                <div className="navbar-brand-bo horizonta-logo">
                  <span className="logo-lgs">
                    <img src={logo} alt="" height="40" />
                  </span>
                </div>
              )} */
  }
  return (
    <React.Fragment>
      <header
        id="page-topbar"
        // className={headerClass}
        className="mb-4"
      >
        <div className="layout-width">
          <Row
            className="navbar-header "
            style={{
              backgroundColor:
                layoutModeType === layoutModeTypes['DARKMODE']
                  ? '#16161a'
                  : '#eff2f7',
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
                  className="btn btn-sfs-16 header-item vertical-menu-btn topnav-hamburger d-block d-md-none"
                  id="topnav-hamburger-icon"
                >
                  <span className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </Col>
              <Col className="d-flex align-items-center  ms-lg-4  ms-md-4  ms-1  col-8">
                <div className="col-sm-12 col-md-7 col-lg-7 col-xs-12 col-12 ">
                  <SearchBar />
                </div>
              </Col>
              <Col lg={3}>
                <div className="d-flex align-items-center justify-content-end">
                  <LightDark
                    layoutMode={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode}
                  />
                  {/* {commentedCode()} */}
                  {currentUser && <ProfileDropdown />}
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
