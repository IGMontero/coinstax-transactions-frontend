import React from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const AssetsSkeleton = (props) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  return (
    <ContentLoader
      viewBox="0 0 1000 400"
      height={400}
      // width={1000}

      backgroundColor={darkMode ? '#333' : '#e0e0e0'}
      foregroundColor={darkMode ? '#555' : '#cfcfcf'}
      style={{
        animation: 'fadeInOut 1s ease-in-out infinite',
        maxWidth: 1000,
        width: '100%',
      }}
      {...props}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const y = 30 + index * 75;
        return (
          <React.Fragment key={index}>
            <circle cx="18" cy={y} r="18" />
            <rect x="55" y={y - 12} rx="5" ry="5" width="90" height="10" />
            <circle cx="65" cy={y + 10} r="8" />
            <rect x="77" y={y + 5} rx="5" ry="5" width="110" height="10" />
            <rect x="285" y={y - 12} rx="5" ry="5" width="80" height="10" />
            <rect x="528" y={y - 12} rx="5" ry="5" width="100" height="10" />
            <rect x="860" y={y - 12} rx="5" ry="5" width="100" height="10" />
            <rect x="860" y={y + 5} rx="5" ry="5" width="120" height="10" />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
};

export default AssetsSkeleton;
``;
