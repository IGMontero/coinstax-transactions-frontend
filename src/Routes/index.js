import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import appLogo from '../assets/images/logos/chainglance/logo-dark.png';
import appLogoLight from '../assets/images/logos/chainglance/logo-light.png';
//Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout';
import VerticalLayout from '../Layouts/index';

//routes
import { useDispatch, useSelector } from 'react-redux';
import { authMe } from '../slices/auth2/thunk';
import { allRoutes, noVerticalLayoutRoutes } from './allRoutes';
import { getTokenFromCookies } from '../helpers/cookies_helper';
import usePortfolioData from '../hooks/useUserPortfolio';
import config from '../config';
import { isDarkMode } from '../utils/utils';

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isProfileComplete = user && user?.profileComplete;

  const [loading, setLoading] = useState(true);

  const [authCompleted, setAuthCompleted] = useState(false);

  const isLoginPage = location.pathname.includes('/login');
  const isRegisterPage = location.pathname.includes('/register');
  const isDashboardPage = location.pathname === '/';

  const token = getTokenFromCookies();

  const userPortfolioData = usePortfolioData(user?.id);

  useEffect(() => {
    const authenticate = async () => {
      console.log('authenticating');
      await dispatch(authMe());


      setAuthCompleted(true);
      setLoading(false);
    };

    authenticate();
  }, []);

  useEffect(() => {
    if (user && (isLoginPage || isRegisterPage || isDashboardPage)) {
      navigate('/wallets');
    }
  }, [user, isLoginPage, navigate, isRegisterPage, isDashboardPage]);


  useEffect(() => {
    if (user && !isProfileComplete) {
      navigate('/complete-profile');
    }
  }, [user, navigate, isProfileComplete]);

  useEffect(() => {
    const isRoot = location.pathname === '/';
    if (isRoot) {
      // Redirect to app root url or base url

      const shouldRedirect =
        window.location.origin !== (config.client.HOME_URL || config.client.CLIENT_URL);

      if (shouldRedirect) {
        window.location.replace(config.client.HOME_URL || config.client.CLIENT_URL);
      }
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          // backgroundColor: '#23282C',
          flexDirection: 'column',
        }}
      >

        {isDarkMode() ?
          <img
            src={appLogo}
            alt="ChainGlance-logo"
            border="0"
            style={{ width: '180px' }}
          />
          : <img
            src={appLogoLight}
            alt="ChainGlance-logo"
            border="0"
            style={{ width: '180px' }}
          />

        }

      </div>
    );
  }

  const noVerticalLayoutDisplay =
    location.pathname === '/dashboard' ||
    location.pathname === '/' ||
    location.pathname === '/invite';

  return (
    <React.Fragment>
      <Routes>
        {noVerticalLayoutDisplay && authCompleted && (
          <Route>
            {noVerticalLayoutRoutes.map((route, idx) => (
              <Route
                path={route.path}
                element={<NonAuthLayout>{route.component}</NonAuthLayout>}
                key={idx}
                exact={true}
              />
            ))}
          </Route>
        )}
        {authCompleted &&
          allRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<VerticalLayout>{route.component}</VerticalLayout>}
              key={idx}
              exact={true}
            />
          ))}

        {/* <Route>
          {allRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route> */}
      </Routes>
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default Index;
