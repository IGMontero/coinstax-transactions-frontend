import Cookies from 'js-cookie';

export const getUserSavedAddresses = () => {
    return Cookies.get('addressess') ? JSON.parse(Cookies.get('addressess')) : [];
};

export const setUserSavedAddresses = (addresses) => {
    Cookies.set('addressess', JSON.stringify(addresses));
};
