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
