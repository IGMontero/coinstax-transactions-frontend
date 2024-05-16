import Cookies from 'js-cookie';
import { isDevelopment } from '../common/constants';

const cookiesDomain = isDevelopment
  ? 'localhost'
  : `.${process.env.REACT_APP_ROOT_DOMAIN}`;

export const getUserSavedAddresses = () => {
  // Get addresses cookie with domain set to the root domain
  return Cookies.get('addresses', {
    domain: cookiesDomain,
  })
    ? JSON.parse(
        Cookies.get('addresses', {
          domain: cookiesDomain,
        }),
      )
    : [];
};

export const setUserSavedAddresses = (addresses) => {
  Cookies.set('addresses', JSON.stringify(addresses), {
    domain: cookiesDomain,
    expires: 365,
  });

  // Cookies.set('addresses', JSON.stringify(addresses));
};

export const getCurrentThemeCookie = () => {
  // Get theme cookie with domain set to the root domain
  return Cookies.get('data-bs-theme', {
    domain: cookiesDomain,
  });
};

export const setCurrentThemeCookie = (theme) => {
  console.log('Will set theme:', theme);
  Cookies.set('data-bs-theme', theme, {
    domain: cookiesDomain,
    expires: 365,
  });
};

export const renameAddressInCookies = (valueToFind, newName) => {
  const storedOptions = getUserSavedAddresses();
  const newOptions = storedOptions.map((storedOption) => {
    if (storedOption.value === valueToFind) {
      return { ...storedOption, label: newName };
    }
    return storedOption;
  });

  setUserSavedAddresses(newOptions);
  return newOptions;
};

export const removeAddressFromCookies = (value) => {
  const storedOptions = getUserSavedAddresses();
  const newOptions = storedOptions.filter(
    (storedOption) => storedOption.value !== value,
  );

  setUserSavedAddresses(newOptions);
  return newOptions;
};

export const handleSaveInCookiesAndGlobalState = (
  address,
  isUnsupported,
  dispatch,
  setAddressName,
) => {
  if (address && !isUnsupported) {
    const storedOptions = getUserSavedAddresses();
    const newOption = {
      label: null,
      value: address,
    };

    const isAddressAlreadySaved = storedOptions.some(
      (o) => o.value === newOption.value,
    );

    if (!isAddressAlreadySaved) {
      storedOptions.unshift(newOption);

      if (storedOptions.length > 10) {
        storedOptions.pop();
      }

      console.log('New stored options: ', storedOptions);

      setUserSavedAddresses(storedOptions);

      dispatch(setAddressName(newOption));
    }
  }
};
