import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { cleanUserWallets } from '../slices/userWallets/reducer';
import { logout } from '../slices/auth2/reducer';
import {
  setPrevAddress,
  setAddressSearched,
} from '../slices/layoutMenuData/reducer';

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
      console.log('Logging out...');
      await dispatch(logout());
      dispatch(setPrevAddress(null));
      dispatch(setAddressSearched(null));

      console.log('Cleaning user wallets...');
      await dispatch(cleanUserWallets());
    } catch (error) {
      console.log(error);
    }
  };

  return handleLogout;
};
