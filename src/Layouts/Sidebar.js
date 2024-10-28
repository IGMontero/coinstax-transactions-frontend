import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import logo from '../assets/images/logos/coinstax_logos/logo-dark.png';
import logoLight from '../assets/images/logos/coinstax_logos/logo-light.png';

//Import Components
import VerticalLayout from './VerticalLayouts/index';
import TwoColumnLayout from './TwoColumnLayout';
import { Button, Container } from 'reactstrap';
import HorizontalLayout from './HorizontalLayout';
import { layoutModeTypes } from '../Components/constants/layout';
import { useSelector } from 'react-redux';

import DropdownPortfolio from '../Components/Dropdowns/DropdownPortfolio';

const Sidebar = ({ layoutType }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const { prevAddress } = useSelector(
    (state) => state.layoutMenuData,
  );


  const isLightMode = layoutModeType === layoutModeTypes['LIGHTMODE'];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  const bgColorStyle = {
    backgroundColor:
      windowSize > 768
        ? layoutModeType === layoutModeTypes['LIGHTMODE']
          ? 'blue'
          : 'transparent'
        : '',
  };

  return (
    <React.Fragment>
      <div
        className="app-menu navbar-menu col-md-2 col-4"
        style={{
          backgroundColor:
            windowSize < 768
              ? layoutModeType === layoutModeTypes['DARKMODE']
                ? '#16161a'
                : 'white'
              : 'transparent',
        }}
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
            <SimpleBar
              id="scrollbar"
            //  className="h-100 "
            >
              <Link
                to={
                  process.env.NODE_ENV === 'development'
                    ? '/wallets'
                    : 'https://chainglance.com/wallets'
                }
                className="d-flex align-items-center justify-content-start"
              >
                <span className="logo-lg d-flex align-items-center justify-content-center">
                  <img
                    src={isLightMode ? logoLight : logo}
                    alt=""
                    className="pt-3"
                    style={{
                      marginBottom: '0.85rem',
                    }}
                    height="auto"
                    width="100"
                  />
                </span>
                {/* // dropdwpn  */}
              </Link>

              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  {user && (
                    <DropdownPortfolio
                      dropdownOpen={dropdownOpen}
                      toggleDropdown={toggleDropdown}
                    />
                  )}
                  <VerticalLayout layoutType={layoutType} />

                  {!user && (
                    <div className="mt-3">
                      {prevAddress && (
                        <hr className="hr-dashed" />
                      )}
                      <span>
                        Create an account to save your address and view your
                        portfolio.
                      </span>
                      <div className="mt-3 ">
                        <Button
                          onClick={() => {
                            navigate('/register');
                          }}
                          className="btn p-2 btn-soft-primary active btn-md"
                        >
                          <span
                            style={{
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Sign Up
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
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
