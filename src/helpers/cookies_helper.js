import Cookies from 'js-cookie';
import { isDevelopment } from '../common/constants';

export const getUserSavedAddresses = () => {
  // Get addresses cookie with domain set to the root domain
  return Cookies.get('addresses', {
    domain: process.env.REACT_APP_ROOT_DOMAIN,
  })
    ? JSON.parse(
      Cookies.get('addresses', {
        domain: process.env.REACT_APP_ROOT_DOMAIN,
      }),
    )
    : [];
};

export const setUserSavedAddresses = (addresses) => {
  Cookies.set('addresses', JSON.stringify(addresses), {
    domain: isDevelopment
      ? 'localhost'
      : `${process.env.REACT_APP_ROOT_DOMAIN}`,
    expires: 365,
  });

  Cookies.set('addresses', JSON.stringify(addresses));
};

export const getCurrentThemeCookie = () => {
  // Get theme cookie with domain set to the root domain
  return Cookies.get('data-bs-theme', {
    domain: process.env.REACT_APP_ROOT_DOMAIN,
  });
};

export const setCurrentThemeCookie = (theme) => {
  Cookies.set('data-bs-theme', theme, {
    domain: isDevelopment
      ? 'localhost'
      : `${process.env.REACT_APP_ROOT_DOMAIN}`,
    expires: 365,
  });

  Cookies.set('data-bs-theme', theme);
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
