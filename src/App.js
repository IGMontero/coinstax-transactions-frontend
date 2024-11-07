import React, { useEffect } from 'react';

//import Scss
import 'react-loading-skeleton/dist/skeleton.css';
import './assets/scss/themes.scss';
import 'react-toastify/dist/ReactToastify.css';

//import Route
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import JobsManager from './Components/JobsManager/JobsManager';
import config from './config';
import { useGetFixedData } from './hooks/fixedData';
import { ConnectWalletProvider } from './Providers/ConnectWalletProvider';
import Route from './Routes';

if (config.google.MEASUREMENT_ID)
  ReactGA.initialize(config.google.MEASUREMENT_ID || '')

function App() {
  const location = useLocation();
  const fetchFixedData = useGetFixedData();

  useEffect(() => {
    const loadFixedData = async () => {
      await fetchFixedData();
    };

    loadFixedData();
  }, [fetchFixedData]);

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);

  return (
    <React.Fragment>
      <ConnectWalletProvider>
        <JobsManager />
        <Route />
      </ConnectWalletProvider>
    </React.Fragment>
  );
}

export default App;
