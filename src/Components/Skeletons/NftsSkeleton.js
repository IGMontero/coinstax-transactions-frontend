import React from 'react';
import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const NftsSkeleton = (props) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];

  const skeletonCount = props.isDashboardPage ? 5 : 10;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: props.isDashboardPage ? 'nowrap' : 'wrap',
        gap: '10px',
        width: '100%',
        marginTop: props.isDashboardPage ? '0px' : '100px',
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ContentLoader
          key={index}
          width={200}
          height={330}
          viewBox="0 0 200 300"
          backgroundColor={darkMode ? '#333' : '#e0e0e0'}
          foregroundColor={darkMode ? '#555' : '#cfcfcf'}
          style={{
            animation: 'fadeInOut 1s ease-in-out infinite',
            maxWidth: '99vw',
            width: '100%',
            flex: '1 1 186px',
          }}
          {...props}
        >
          <rect x="10" y="30" rx="10" ry="10" width="180" height="30" />
          <rect x="10" y="30" rx="10" ry="10" width="180" height="220" />
          {/* <rect x="30" y="50" rx="8" ry="8" width="140" height="140" /> */}
          <rect x="10" y="220" rx="10" ry="10" width="180" height="30" />
        </ContentLoader>
      ))}
    </div>
  );
};

export default NftsSkeleton;
