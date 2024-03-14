import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
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

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

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
      // document.querySelector(".hamburger-icon").classList.toggle('open');
      return;
    }
    dispatch(changeSidebarVisibility('show'));

    //For collapse horizontal menu
    if (document.documentElement.getAttribute('data-layout') === 'horizontal') {
      document.body.classList.contains('menu')
        ? document.body.classList.remove('menu')
        : document.body.classList.add('menu');
    }

    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === 'show' &&
      (document.documentElement.getAttribute('data-layout') === 'vertical' ||
        document.documentElement.getAttribute('data-layout') === 'semibox')
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'sm'
          ? document.documentElement.setAttribute('data-sidebar-size', '')
          : document.documentElement.setAttribute('data-sidebar-size', 'sm');
      } else if (windowSize > 1025) {
        document.body.classList.remove('vertical-sidebar-enable');
        document.documentElement.getAttribute('data-sidebar-size') === 'lg'
          ? document.documentElement.setAttribute('data-sidebar-size', 'sm')
          : document.documentElement.setAttribute('data-sidebar-size', 'lg');
      } else if (windowSize <= 767) {
        document.body.classList.add('vertical-sidebar-enable');
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute('data-layout') === 'twocolumn') {
      document.body.classList.contains('twocolumn-panel')
        ? document.body.classList.remove('twocolumn-panel')
        : document.body.classList.add('twocolumn-panel');
    }
  };

  return (
    <React.Fragment>
      {/* <header id="page-topbar" className={headerClass}> */}
      <header id={`${currentUser ? 'page' : 'page'}`} className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {!currentUser && (
                <div className="navbar-brand-bo horizonta-logo">
                  <span className="logo-lgs">
                    <img src={logo} alt="" height="40" />
                  </span>
                </div>
              )}
              {currentUser ? (
                <button
                  onClick={toogleMenuBtn}
                  type="button"
                  className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger d-block d-md-none"
                  id="topnav-hamburger-icon"
                >
                  <span className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              ) : null}

              {/* <SearchOption /> */}
            </div>

            <div className="d-flex align-items-center">
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
              {currentUser && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
