import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const AssetsSkeleton = () => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 955);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 955);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? '#333' : '#f3f3f3'}
      highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1050px',
          margin: 'auto',
          padding: '0px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '10px',
            marginTop: '20px',
            borderBottom: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
          }}
        >
          <Skeleton width={100} height={20} />
          {!isSmallScreen && (
            <>
              <Skeleton width={60} height={20} />
              <Skeleton width={60} height={20} />
            </>
          )}
          <Skeleton width={60} height={20} />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 0',
              borderBottom: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton circle width={35} height={35} />
              <div style={{ marginLeft: '20px' }}>
                <Skeleton width={90} height={10} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '2px',
                  }}
                >
                  <Skeleton circle width={16} height={16} />
                  <Skeleton
                    width={100}
                    height={10}
                    style={{ marginLeft: '5px', marginTop: '5px' }}
                  />
                </div>
              </div>
            </div>
            {!isSmallScreen && (
              <>
                <Skeleton
                  width={100}
                  height={10}
                  style={{ marginLeft: '10px' }}
                />
                <Skeleton
                  width={100}
                  height={10}
                  style={{ marginLeft: '50px' }}
                />
              </>
            )}
            {isSmallScreen ? (
              <div>
                <Skeleton width={100} height={10} />
                <Skeleton
                  width={100}
                  height={10}
                  style={{ marginTop: '5px' }}
                />
              </div>
            ) : (
              <div>
                <Skeleton width={100} height={10} />
                <Skeleton
                  width={100}
                  height={10}
                  style={{ marginTop: '5px' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default AssetsSkeleton;
