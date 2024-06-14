import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const NftsSkeleton = (props) => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const darkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const skeletonCount = props.isDashboardPage ? 4 : 10;

  return (
    <SkeletonTheme
      baseColor={darkMode ? '#333' : '#e0e0e0'}
      highlightColor={darkMode ? '#555' : '#cfcfcf'}
    >
      <div style={{ padding: `${props.isDashboardPage ? '15px' : '0px'}` }}>
        {!props.isDashboardPage ? (
          <div style={{ marginBottom: '20px' }}>
            <Skeleton width={200} height="15px" />
            <Skeleton width={200} height="15px" style={{ marginTop: '10px' }} />
            <Skeleton width={250} height="25px" style={{ marginTop: '10px' }} />
            <Skeleton width={200} height="15px" style={{ marginTop: '10px' }} />
          </div>
        ) : null}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(186px, 1fr))',
            gap: '30px',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div
              key={index}
              style={{
                maxWidth: '186px',
                width: '100%',
                height: '280px',
                borderRadius: '10px',
                background: darkMode ? '#333' : '#e0e0e0',
                padding: '10px',
                boxSizing: 'border-box',
              }}
            >
              <Skeleton
                width="100%"
                height="160px"
                style={{ borderRadius: '10px' }}
              />
              <Skeleton
                width="80%"
                height="20px"
                style={{ marginTop: '10px', borderRadius: '5px' }}
              />
              <Skeleton
                width="60%"
                height="20px"
                style={{ marginTop: '5px', borderRadius: '5px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NftsSkeleton;
