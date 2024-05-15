import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withRouter from '../Components/Common/withRouter';

//import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RightSidebar from '../Components/Common/RightSidebar';

//import actions
import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
  changeSidebarVisibility,
} from '../slices/thunks';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AddressWithDropdown from '../Components/Address/AddressWithDropdown';
import { layoutModeTypes } from '../Components/constants/layout';
import { setCurrentThemeCookie } from '../helpers/cookies_helper';

const Layout = (props) => {
  const [headerClass, setHeaderClass] = useState('');
  const dispatch = useDispatch();
  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
  } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
    leftSidebarType: state.Layout.leftSidebarType,
    layoutModeType: state.Layout.layoutModeType,
    layoutWidthType: state.Layout.layoutWidthType,
    layoutPositionType: state.Layout.layoutPositionType,
    topbarThemeType: state.Layout.topbarThemeType,
    leftsidbarSizeType: state.Layout.leftsidbarSizeType,
    leftSidebarViewType: state.Layout.leftSidebarViewType,
    leftSidebarImageType: state.Layout.leftSidebarImageType,
    sidebarVisibilitytype: state.Layout.sidebarVisibilitytype,
  }));

  /*
    layout settings
    */
  useEffect(() => {
    if (
      layoutType ||
      leftSidebarType ||
      layoutModeType ||
      layoutWidthType ||
      layoutPositionType ||
      topbarThemeType ||
      leftsidbarSizeType ||
      leftSidebarViewType ||
      leftSidebarImageType ||
      sidebarVisibilitytype
    ) {
      window.dispatchEvent(new Event('resize'));
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
      dispatch(changeSidebarImageType(leftSidebarImageType));
      dispatch(changeSidebarVisibility(sidebarVisibilitytype));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
    dispatch,
  ]);
  /*
    call dark/light mode
    */
  const onChangeLayoutMode = (value) => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value));
      setCurrentThemeCookie(
        value === layoutModeTypes.DARKMODE ? 'dark' : 'light',
      );
    }
  };

  // class add remove in header
  useEffect(() => {
    window.addEventListener('scroll', scrollNavigation, true);
  });
  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass('topbar-shadow');
    } else {
      setHeaderClass('');
    }
  }

  // FIXME: Commented out
  useEffect(() => {
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    if (hamburgerIcon) {
      if (
        sidebarVisibilitytype === 'show' ||
        layoutType === 'vertical' ||
        layoutType === 'twocolumn'
      ) {
        hamburgerIcon?.classList?.remove('open');
      } else {
        hamburgerIcon?.classList?.add('open');
      }
    }
  }, [sidebarVisibilitytype, layoutType]);

  const location = useLocation();

  const isAuthPage =
    location.pathname.includes('/login') ||
    location.pathname.includes('/register');

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        {!isAuthPage && (
          <>
            <Header
              headerClass={headerClass}
              layoutModeType={layoutModeType}
              onChangeLayoutMode={onChangeLayoutMode}
            />
            <Sidebar layoutType={layoutType} />
          </>
        )}
        <div className="main-content" style={{ height: '100vh' }}>
          {props.children}
          <Footer />
        </div>
      </div>
      {/* <RightSidebar /> */}
    </React.Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(Layout);
