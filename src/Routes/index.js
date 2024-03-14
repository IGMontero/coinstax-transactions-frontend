import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

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
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    if (localStorage.getItem('token')) {
      await dispatch(authMe());
    }
    setLoading(false);
  };
  useEffect(() => {
    checkUser();

    if (user) {
      navigate('/dashboard');
    }
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
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
