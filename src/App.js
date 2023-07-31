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
  apiKey: 'AIzaSyC9o8thoT959xwBco-DuAZLwvnOfrhcSk8',
  authDomain: 'salespulse360.firebaseapp.com',
  databaseURL: 'https://salespulse360.firebaseio.com',
  projectId: 'salespulse360',
  storageBucket: 'salespulse360.appspot.com',
  messagingSenderId: '446068328112',
  appId: '1:446068328112:web:bbbeaef85a600213585d75',
  // measurementId: process.env.REACT_APP_MEASUREMENTID,
};


// init firebase backend
initFirebaseBackend(firebaseConfig);

console.log("app!!");

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
