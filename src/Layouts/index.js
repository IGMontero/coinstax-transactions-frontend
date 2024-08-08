import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import withRouter from '../Components/Common/withRouter';
import { networks } from '../common/constants';

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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddressWithDropdown from '../Components/Address/AddressWithDropdown';
import { layoutModeTypes } from '../Components/constants/layout';
import { setCurrentThemeCookie } from '../helpers/cookies_helper';
import { getAddressesInfo } from '../slices/addresses/thunk';
import {
  selectNetworkType,
  setNetworkType,
} from '../slices/networkType/reducer';
import { setAddressSummary } from '../slices/addresses/reducer';
import UnsupportedPage from '../Components/UnsupportedPage/UnsupportedPage';
import { setAddressName } from '../slices/addressName/reducer';
import { pagesWithoutAddress } from '../common/constants';
import { getCurrentUserPortfolioSummary } from '../slices/userWallets/thunk';
const Layout = (props) => {
  const { token, contractAddress, address } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const networkType = useSelector(selectNetworkType);

  const [isOnlyAllNetwork, setIsOnlyAllNetwork] = useState(false);
  const [headerClass, setHeaderClass] = useState('');
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

  // #region Address Info & networks
  const isAuthPage =
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password') ||
    location.pathname.includes('/reset-password');

  const isAdminPages =
    location.pathname.includes('blockchain-contracts') ||
    location.pathname.includes('user-addresses');

  const pagesNotToDisplayAddress = useMemo(() => pagesWithoutAddress, []);

  const fetchControllerRef = useRef(new AbortController());
  const fetchInterval = useRef(null);
  const [filteredNetworks, setFilteredNetworks] = useState(networks);
  const [loading, setLoading] = useState(true);
  const [isInInterval, setIsInInterval] = useState(false);
  const [isSuccessfullRequest, setIsSuccessfullRequest] = useState(false);

  const [isUnsupported, setIsUnsupported] = useState(false);

  const [incompleteBlockchains, setIncompleteBlockchains] = useState([]);

  const [nickName, setNickName] = useState(null);

  const isCurrentUserPortfolioSelected =
    location.pathname.includes('portfolio');

  const { userPortfolioSummary } = useSelector((state) => state.userWallets);

  const { user } = useSelector((state) => state.auth);

  const userId = user?.id;

  const fetchAddressInfo = async () => {
    fetchControllerRef.current.abort();
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    try {
      setLoading(true);

      const request = isCurrentUserPortfolioSelected
        ? dispatch(getCurrentUserPortfolioSummary({ userId, signal })).unwrap()
        : dispatch(getAddressesInfo({ address: address, signal }));

      const response = await request;
      const res = isCurrentUserPortfolioSelected ? response : response.payload;

      if (res) {
        if (res.blockchains) {
          const incomplete = Object.entries(res?.blockchains)
            .filter(([, blockchain]) => blockchain.complete === false)
            .map(([key]) => key);
          setIncompleteBlockchains(incomplete);
        } else {
          setIncompleteBlockchains([]);
        }

        if (res.complete) {
          clearInterval(fetchInterval.current);
          fetchInterval.current = null;
          setIsInInterval(false);
          setLoading(false);
        } else if (!fetchInterval.current) {
          setIsInInterval(true);
          fetchInterval.current = setInterval(fetchAddressInfo, 5000);
        }
        if (res.unsupported) {
          setIsUnsupported(true);
        }

        if (!res.blockchains) {
          setIsInInterval(false);
          return;
        }

        const availableNetworks = Object.keys(res.blockchains);
        let filtered;
        if (isAdminPages) {
          filtered = networks;
        } else {
          filtered = networks
            .filter(
              (network) =>
                network.key !== 'all' &&
                availableNetworks.includes(network.blockchain),
            )
            .map((network) => ({
              ...network,
              totalValue: res.blockchains[network.blockchain]?.totalValue,
              nftsValue: res.blockchains[network.blockchain]?.nftsValue,
            }));

          if (res.blockchains.all) {
            const allNetwork = networks.find((n) => n.key === 'all');
            allNetwork.totalValue = res.blockchains.all.totalValue;
            allNetwork.nftsValue = res.blockchains.all.nftsValue;
            filtered.unshift(allNetwork);
          }

          if (res.nickname) {
            setNickName(res.nickname);
          }

          const newNetworkType =
            filtered.find((n) => n.key === networkType)?.key || 'all';
          if (newNetworkType !== networkType) {
            dispatch(setNetworkType(newNetworkType));
          }

          setFilteredNetworks(filtered);

          setIsOnlyAllNetwork(
            availableNetworks.length === 1 && availableNetworks[0] === 'all',
          );
        }
        setIsSuccessfullRequest(true);
        dispatch(setAddressSummary(res.blockchains));
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setIsSuccessfullRequest(true);
      } else {
        console.error('Error fetching address info: ', error);
        setIsSuccessfullRequest(false);
      }

      console.log(error);
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
        fetchInterval.current = null;
        setIsInInterval(false);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setIsUnsupported(false);
    }
    if (address || isCurrentUserPortfolioSelected) {
      const loadAddressInfo = async () => {
        if (fetchInterval.current) {
          clearInterval(fetchInterval.current);
          fetchInterval.current = null;
        }
        setIsInInterval(false);
        setIsUnsupported(false);
        setNickName(null);
        await fetchAddressInfo();
      };

      loadAddressInfo();

      return () => {
        if (fetchInterval.current) {
          clearInterval(fetchInterval.current);
          fetchInterval.current = null;
        }
        fetchControllerRef.current.abort();
      };
    }
  }, [token, address]);

  const isPageWithoutAddress = (pathname) => {
    if (pagesNotToDisplayAddress.includes(pathname)) {
      return true;
    }
    const dynamicRoutes = [
      '/clients/:clientId',
      '/admin/users/:userId',
      '/admin/accountants/:userId',
      '/admin/clients/:clientId',
    ];
    for (const route of dynamicRoutes) {
      const regex = new RegExp(
        `^${route.replace(/:(clientId|userId)/g, '[^/]+')}$`,
      );
      if (regex.test(pathname)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (
      !address &&
      !token &&
      !contractAddress &&
      !isPageWithoutAddress(location.pathname) &&
      !isCurrentUserPortfolioSelected
    ) {
      alert('Error in address with dropdown');
      navigate('/');
    }
  }, [
    address,
    token,
    contractAddress,
    location.pathname,
    navigate,
    pagesNotToDisplayAddress,
    isCurrentUserPortfolioSelected,
  ]);

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
        <div
          className={isAuthPage ? '' : 'main-content'}
          style={{ height: '100vh' }}
        >
          <div className="page-content">
            {!isPageWithoutAddress(location.pathname) &&
              !token &&
              !contractAddress && (
                <AddressWithDropdown
                  isUnsupported={isUnsupported}
                  addressNickName={nickName}
                  isOnlyAllNetwork={isOnlyAllNetwork}
                  filteredNetworks={filteredNetworks}
                  incompleteBlockchains={incompleteBlockchains}
                  loading={loading && !isInInterval}
                />
              )}
            {(() => {
              if (
                token ||
                contractAddress ||
                isPageWithoutAddress(location.pathname)
              ) {
                return props.children;
              } else if (isUnsupported) {
                return <UnsupportedPage />;
              } else if (!loading || isInInterval) {
                if (isSuccessfullRequest) {
                  return props.children;
                } else {
                  return null;
                }
              } else {
                return null;
              }
            })()}
          </div>
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
