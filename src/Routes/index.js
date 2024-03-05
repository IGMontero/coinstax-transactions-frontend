import React from 'react';
import { Routes, Route } from 'react-router-dom';

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

const Index = () => {
  const currentUser = localStorage.getItem('currentUser');

  return (
    <React.Fragment>
      <Routes>
        {allRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              currentUser ? (
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
