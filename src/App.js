import React, { useEffect } from 'react';
import firebase from 'firebase/compat/app';

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

// Import Firebase Configuration file
import { initFirebaseBackend } from "./helpers/firebase_helper";
import { useDispatch } from 'react-redux';
import { profileSuccess } from './slices/auth/profile/reducer';
import { loginSuccess } from './slices/auth/login/reducer';

const firebaseConfig = {
  apiKey: "AIzaSyCfEYQQmkM9taJQlPAnjk4eAulGgYd3VwE",
  authDomain: "ifyoulike-7617d.firebaseapp.com",
  projectId: "ifyoulike-7617d",
  storageBucket: "ifyoulike-7617d.appspot.com",
  messagingSenderId: "669545742928",
  appId: "1:669545742928:web:eef83dfe2812f8fa9f8755"
};


// init firebase backend
initFirebaseBackend(firebaseConfig);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
        dispatch(profileSuccess(user));
        dispatch(loginSuccess(user));
      } else {
        localStorage.removeItem("authUser");
      }
    });
  }, [firebase]);

  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;
