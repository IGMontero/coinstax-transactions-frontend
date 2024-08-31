import React, { useEffect } from 'react';

//import Scss
import './assets/scss/themes.scss';
import 'react-loading-skeleton/dist/skeleton.css';

//import Route
import Route from './Routes';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { AppKitProvider } from './Providers/AppKitProvider';

ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID || '');

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview', page: location.pathname + location.search,
      title: document.title
    });
  }, [location]);

  return (
    <React.Fragment>
      <AppKitProvider>
        <Route />
      </AppKitProvider>
    </React.Fragment>
  );
}

export default App;
