import React from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const TransactionSkeleton = (props) => {
  const baseY = 90;
  const deltaY = 100;

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  return (
    <ContentLoader
      height={1200}
      marginTop={10}
      backgroundColor={darkMode ? '#333' : '#e0e0e0'}
      foregroundColor={darkMode ? '#555' : '#cfcfcf'}
      // gradientRatio={0.5}
      // speed={2}
      style={{
        animation: 'fadeInOut 1s ease-in-out infinite',
        maxWidth: '99vw',
        width: '100%',
      }}
      {...props}
    >
      {Array.from({ length: 10 }).map((_, index) => {
        const y = baseY + index * deltaY;

        return (
          <React.Fragment key={index}>
            <circle cx="30" cy={y} r="20" />
            <rect x="60" y={y - 16} rx="5" ry="5" width="100" height="12" />
            <rect x="60" y={y + 1} rx="5" ry="5" width="100" height="12" />

            <circle cx="380" cy={y} r="20" />
            <rect x="425" y={y - 16} rx="5" ry="5" width="150" height="12" />
            <rect x="425" y={y + 1} rx="5" ry="5" width="120" height="12" />

            <rect x="1025" y={y - 16} rx="5" ry="5" width="100" height="12" />
            <rect x="1025" y={y + 1} rx="5" ry="5" width="100" height="12" />

            <rect x="10" y={y + 35} rx="5" ry="5" width="1200" height="2" />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
};

export default TransactionSkeleton;
