import React from 'react';
import ContentLoader from 'react-content-loader';
import { layoutModeTypes } from '../constants/layout';
import { useSelector } from 'react-redux';

const GraphBtnsSkeleton = (props) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  return (
    <ContentLoader
      speed={2}
      width="75vw"
      height="100px"
      viewBox="0 0 1163 520"
      backgroundColor={darkMode ? '#333' : '#e0e0e0'}
      color={darkMode ? '#555' : '#cfcfcf'}
      foregroundColor={darkMode ? '#555' : '#cfcfcf'}
      style={{
        animation: 'fadeInOut 1s ease-in-out infinite',
      }}
      {...props}
    >
      <rect x="0" y="20" rx="5" ry="5" width="100" height="60" />
      <rect x="100" y="20" rx="5" ry="5" width="100" height="60" />
      <rect x="500" y="20" rx="5" ry="5" width="100" height="60" />
      <rect x="800" y="20" rx="5" ry="5" width="100" height="60" />
    </ContentLoader>
  );
};

export default GraphBtnsSkeleton;
