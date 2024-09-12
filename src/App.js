import React, { useEffect } from 'react';

//import Scss
import 'react-loading-skeleton/dist/skeleton.css';
import './assets/scss/themes.scss';

//import Route
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { ConnectWalletProvider } from './Providers/ConnectWalletProvider';
import Route from './Routes';
import JobsManager from './Components/JobsManager/JobsManager';

ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID || '');

function App() {
  const location = useLocation();

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
