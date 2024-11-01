import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { cleanUserWallets } from '../slices/userWallets/reducer';
import {
  setPrevAddress,
  setAddressSearched,
} from '../slices/layoutMenuData/reducer';
import config from '../config';
import { logout } from '../slices/auth2/thunk';

export const useCurrentUser = () => {
  const { user } = useSelector((state) => state.auth);
  return user;
};

export const useLogOut = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to invalidate the token on the server
      await dispatch(logout());

      // Clear client-side data
      dispatch(setPrevAddress(null));
      dispatch(setAddressSearched(null));
      await dispatch(cleanUserWallets());

      // Redirect to base URL
      window.location.href = config.client.CLIENT_URL;
    } catch (error) {
      console.log(error);
    }

    // Navigate to base url of the site.
    window.location.href = config.client.CLIENT_URL
  };

  return handleLogout;
};
