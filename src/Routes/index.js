import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import appLogo from '../assets/images/logos/logo-dark.png';
//Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout';
import VerticalLayout from '../Layouts/index';

//routes
import { authProtectedRoutes, publicRoutes, allRoutes } from './allRoutes';
import { AuthProtected } from './AuthProtected';
import { useProfile } from '../Components/Hooks/UserHooks';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import Sidebar from '../Layouts/Sidebar';
import { authMe } from '../slices/auth2/thunk';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  console.log(user);

  const checkUser = async () => {
    if (localStorage.getItem('token')) {
      await dispatch(authMe());
    }
    setLoading(false);
  };

  const isLoginPage = location.pathname.includes('/login');
  useEffect(() => {
    checkUser();

    if (user && isLoginPage) {
      navigate('/dashboard');
    }
  }, [dispatch, user]);

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
          alt="Coinstax-logo"
          border="0"
          style={{ width: '50vw', maxWidth: '320px' }}
        />

        <h3 className="text-white mt-2"> Loading..</h3>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Routes>
        {allRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              user ? (
                <VerticalLayout>{route.component}</VerticalLayout>
              ) : (
                <>
                  <Header />
                  <NonAuthLayout>{route.component}</NonAuthLayout>
                </>
              )
            }
            key={idx}
            exact={true}
          />
        ))}
        {/* {!isAuth && (
                    <Route>

                        {publicRoutes.map((route, idx) => (
                            <Route
                                path={route.path}
                                element={
                                    <NonAuthLayout>
                                        {route.component}
                                    </NonAuthLayout>
                                }
                                key={idx}
                                exact={true}
                            />
                        ))}
                    </Route>
                )}
*/}

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
