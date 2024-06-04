import React from 'react';
import ContentLoader from 'react-content-loader';
import { layoutModeTypes } from '../constants/layout';
import { useSelector } from 'react-redux';

const GraphSkeleton = (props) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  return (
    <ContentLoader
      speed={2}
      // height="50vh"
      viewBox="0 0 1163 520"
      backgroundColor={darkMode ? '#333' : '#e0e0e0'}
      color={darkMode ? '#555' : '#cfcfcf'}
      foregroundColor={darkMode ? '#555' : '#cfcfcf'}
      style={{
        animation: 'fadeInOut 1s ease-in-out infinite',
        maxWidth: '99vw',
        width: '100%',
      }}
      {...props}
    >
      <rect x="0" y="20" rx="5" ry="5" width="200" height="40" />
      <rect x="0" y="70" rx="5" ry="5" width="200" height="20" />
      {/* <rect x="0" y="0" rx="0" ry="0" width="200" height="200" fill="#f3f3f3" /> */}
      {/* Líneas del gráfico */}
      <path
        d="M0,450 L150,200 L300,300 L450,250 L580,330 L750,200 L900,240 L1050,150 L1200,170 L1350,350 L1500,200 L1650,300 L1800,450"
        stroke="black"
        strokeWidth="3"
        fill="transparent"
      />

      {/* Puntos del gráfico */}
      {/* <circle cx="0" cy="450" r="10" fill="black" />
      <circle cx="200" cy="250" r="10" fill="black" />
      <circle cx="400" cy="350" r="10" fill="black" />
      <circle cx="600" cy="150" r="10" fill="black" />
      <circle cx="800" cy="350" r="10" fill="black" />
      <circle cx="1000" cy="250" r="10" fill="black" />
      <circle cx="1200" cy="350" r="10" fill="black" /> */}
    </ContentLoader>
  );
};

export default GraphSkeleton;
