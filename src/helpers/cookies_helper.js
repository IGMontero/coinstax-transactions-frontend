import Cookies from 'js-cookie';

export const getUserSavedAddresses = () => {
  return Cookies.get('addressess') ? JSON.parse(Cookies.get('addressess')) : [];
};

export const setUserSavedAddresses = (addresses) => {
  Cookies.set('addressess', JSON.stringify(addresses));
};

export const getCurrentThemeCookie = () => {
  return Cookies.get('data-bs-theme');
};

export const setCurrentThemeCookie = (theme) => {
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
