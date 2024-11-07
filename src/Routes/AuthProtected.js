import React from 'react';
import { Route } from 'react-router-dom';



const AuthProtected = (props) => {
  // const dispatch = useDispatch();
  // const { userProfile, loading, token } = useProfile();
  // useEffect(() => {
  //   if (userProfile && !loading && token) {
  //     setAuthorization(token);
  //   } else if (!userProfile && loading && !token) {
  //     dispatch(logoutUser());
  //   }
  // }, [token, userProfile, loading, dispatch]);

  /*
    redirect is un-auth access protected routes via url
    */

  // if (!userProfile && loading && !token) {
  //   return (
  //     <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
  //   );
  // }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <React.Suspense fallback={<div />}>
      <Route
        {...rest}
        render={(props) => {
          return (
            <>
              {' '}
              <Component {...props} />{' '}
            </>
          );
        }}
      />
    </React.Suspense>
  );
};

export { AccessRoute, AuthProtected };

