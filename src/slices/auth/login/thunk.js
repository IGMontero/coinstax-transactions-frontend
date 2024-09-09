//Include Both Helper File with needed methods
import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import {
  postFakeLogin,
  postJwtLogin,
} from '../../../helpers/fakebackend_helper';

import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from './reducer';
import { profileSuccess } from '../profile/reducer';
import { cleanUserWallets } from '../../userWallets/reducer';

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === 'jwt') {
      response = postJwtLogin({
        email: user.email,
        password: user.password,
      });
    } else if (process.env.REACT_APP_API_URL) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;

    if (data) {
      localStorage.setItem('authUser', JSON.stringify(data));
      if (process.env.REACT_APP_DEFAULTAUTH === 'fake') {
        var finallogin = JSON.stringify(data);
        finallogin = JSON.parse(finallogin);
        data = finallogin.data;
        if (finallogin.status === 'success') {
          dispatch(loginSuccess(data));
          dispatch(profileSuccess(data));
          history('/');
        } else {
          dispatch(apiError(finallogin));
        }
      } else {
        dispatch(loginSuccess(data));
        dispatch(profileSuccess(data));
        history('/');
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};
export const logoutUser = () => async (dispatch) => {
  try {
    const fireBaseBackend = getFirebaseBackend();

    fireBaseBackend.logout();

    // cleanUserWallets
    dispatch(logoutUserSuccess());
    dispatch(cleanUserWallets());
  } catch (error) {
    console.log(error);
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      localStorage.setItem('authUser', JSON.stringify(socialdata));
      dispatch(loginSuccess(socialdata));
      dispatch(profileSuccess({ data: socialdata }));
      history('/dashboard');
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
