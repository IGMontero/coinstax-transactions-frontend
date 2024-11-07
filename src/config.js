module.exports = {
  app: {
    name: process.env.REACT_APP_NAME || "ChainGlance",
    version: process.env.REACT_APP_VERSION || "0.0.1",
  },
  api: {
    API_URL: process.env.REACT_APP_API_URL_BASE,
  },
  client: {
    CLIENT_URL: process.env.REACT_APP_CLIENT_URL,
    ROOT_DOMAIN: process.env.REACT_APP_ROOT_DOMAIN,
    HOME_URL: process.env.REACT_APP_HOME_URL,
  },
  google: {
    MEASUREMENT_ID: process.env.REACT_APP_GA_MEASUREMENT_ID,
  },
  walletConnect: {
    PROJECT_ID: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || 'f3ec191ff1a02016249d76c9de7ad02b'
  },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};
