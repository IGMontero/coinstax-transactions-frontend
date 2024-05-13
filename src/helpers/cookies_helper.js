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
    });

    Cookies.set('data-bs-theme', theme);
};
