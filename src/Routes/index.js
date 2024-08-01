import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import appLogo from '../assets/images/logos/logo-light.png';
//Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout';
import VerticalLayout from '../Layouts/index';

//routes
import { useDispatch, useSelector } from 'react-redux';
import { authMe } from '../slices/auth2/thunk';
import { allRoutes, noVerticalLayoutRoutes } from './allRoutes';
import { getTokenFromCookies } from '../helpers/cookies_helper';
import usePortfolioData from '../hooks/useUserPortfolio';

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [authCompleted, setAuthCompleted] = useState(false);

  const isLoginPage = location.pathname.includes('/login');
  const isRegisterPage = location.pathname.includes('/register');

  const token = getTokenFromCookies();

  const userPortfolioData = usePortfolioData(user?.id);

  useEffect(() => {
    const authenticate = async () => {
      if (token) {
        await dispatch(authMe());
      }
      setAuthCompleted(true);
      setLoading(false);
    };

    authenticate();
  }, [dispatch]);

  useEffect(() => {
    if (user && (isLoginPage || isRegisterPage)) {
      navigate('/');
    }
  }, [user, isLoginPage, navigate]);

  useEffect(() => {
    const isRoot = location.pathname === '/';

    if (isRoot) {
      // Redirect to app root url or base url

      const isOriginSameAsCurrent =
        window.location.origin === process.env.REACT_APP_ROOT_URL;
      const shouldRedirect =
        !isOriginSameAsCurrent && process.env.REACT_APP_ROOT_URL;

      if (shouldRedirect) {
        window.location.href = process.env.REACT_APP_ROOT_URL;
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
          backgroundColor: '#23282C',
          flexDirection: 'column',
        }}
      >
        <img
          src={appLogo}
          alt="ChainGlance-logo"
          border="0"
          style={{ width: '50vw', maxWidth: '320px' }}
        />

        <h3 className="text-white mt-2"> Loading...</h3>
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
