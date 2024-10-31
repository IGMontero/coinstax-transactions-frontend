import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { cleanUserWallets } from '../slices/userWallets/reducer';
import { logout } from '../slices/auth2/reducer';
import {
  setPrevAddress,
  setAddressSearched,
} from '../slices/layoutMenuData/reducer';
import config from '../config';

export const useCurrentUser = () => {
  const { user } = useSelector((state) => state.auth);
  return user;
};

export const useLogOut = () => {
  // const { logout } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Dispatch logout and clean up necessary data.
  const handleLogout = async () => {
    try {
      await dispatch(logout());
      dispatch(setPrevAddress(null));
      dispatch(setAddressSearched(null));
      await dispatch(cleanUserWallets());
    } catch (error) {
      console.log(error);
    }

    // Navigate to base url of the site.
    window.location.href = config.client.CLIENT_URL
  };

  return handleLogout;
};
