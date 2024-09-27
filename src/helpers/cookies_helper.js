import Cookies from 'js-cookie';
import { isDevelopment } from '../common/constants';

const cookiesDomain = isDevelopment
  ? 'localhost'
  : `.${process.env.REACT_APP_ROOT_DOMAIN}`;

// Token functions
export const saveTokenInCookies = (token) => {
  Cookies.set('token', token, {
    expires: 365,
    domain: cookiesDomain,
  });

  // Save also in lcal storage for now.
  localStorage.setItem('accessToken', token);
};

export const saveCountryInCookies = (country) => {
  Cookies.set('country', country, {
    expires: 365,
    domain: cookiesDomain,
  });
};

export const getTokenFromCookies = () => {
  const cookieToken = Cookies.get('token', {
    domain: cookiesDomain,
  });

  if (cookieToken) {
    return cookieToken;
  }

  // Fallback to local storage
  return localStorage.getItem('accessToken');

};

export const removeTokenFromCookies = () => {
  Cookies.remove('token', {
    domain: cookiesDomain,
  });

  // Remove also from local storage
  localStorage.removeItem('accessToken');
};

// App options
export const getAppOptions = () => {
  const defaultOptions = {
    blockchain: 'ethereum',
    hideSmallBalances: false,
    hideZeroBalances: true,
  };
  const options = Cookies.get('appOptions');
  return options ? JSON.parse(options) : defaultOptions;
};

export const setAppOptions = (options) => {
  Cookies.set('appOptions', JSON.stringify(options), {
    domain: cookiesDomain,
    expires: 365,
  });
};

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
  // isUnsupported,
  dispatch,
  setAddressName,
) => {
  if (address) {
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
