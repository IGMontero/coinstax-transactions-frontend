//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeRegister,
  postJwtRegister,
} from "../../../helpers/fakebackend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange
} from "./reducer";
import { useDispatch } from "react-redux";

// initialize relavant method of both Auth
let fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = async (user, dispatch) => {
  try {
    let response;

    fireBaseBackend = getFirebaseBackend();

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.registerUser(user.email, user.password, user.first_name, user.last_name);

      console.log("Response sign up:" , response)

      if (response.message === "success") {
        dispatch(registerUserSuccessful(response));
      } else {
        dispatch(registerUserFailed(response));
      }
      // yield put(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtRegister('/post-jwt-register', user);
      // yield put(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_API_URL) {
      response = postFakeRegister(user);
      const data = await response;

      if (data.message === "success") {
        dispatch(registerUserSuccessful(data));
      } else {
        dispatch(registerUserFailed(data));
      }
    }
  } catch (error) {
    dispatch(registerUserFailed(error));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange();
    return response;
  } catch (error) {
    return error;
  }
};