import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';
import { layoutModeTypes } from '../constants/layout';

const TransactionSkeleton = () => {
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));

  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
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
          maxWidth: '1200px',
          margin: 'auto',
          padding: '10px',
          marginTop: '3px',
        }}
      >
        <div
          style={{
            padding: '15px 0',
            borderBottom: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
          }}
        >
          <Skeleton
            width={125}
            height={10}
            style={{
              marginTop: '5px',
            }}
          />
        </div>

        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              alignItems: isSmallScreen ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              padding: '20px 0',
              borderBottom: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: isSmallScreen ? '10px' : '0',
                width: isSmallScreen ? '100%' : 'auto',
              }}
            >
              <Skeleton circle width={35} height={35} />
              <div style={{ marginLeft: '10px' }}>
                <Skeleton width={60} height={10} />
                <Skeleton
                  width={100}
                  height={10}
                  style={{ marginTop: '5px' }}
                />
              </div>
              {isSmallScreen && (
                <div style={{ marginLeft: 'auto', marginRight: '70px' }}>
                  <Skeleton width={50} height={10} />
                  <Skeleton
                    width={60}
                    height={10}
                    style={{ marginTop: '5px' }}
                  />
                </div>
              )}
            </div>
            {!isSmallScreen && (
              <div>
                <Skeleton width={50} height={10} />
                <Skeleton width={60} height={10} style={{ marginTop: '5px' }} />
              </div>
            )}
            <div
              // className="d-none"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: isSmallScreen ? '10px' : '0',
                width: isSmallScreen ? '100%' : 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton circle width={35} height={35} />
                <div style={{ marginLeft: '10px' }}>
                  <Skeleton width={50} height={10} />
                  <Skeleton
                    width={90}
                    height={10}
                    style={{ marginTop: '5px' }}
                  />
                </div>
              </div>
              {isSmallScreen && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: 'auto',
                  }}
                >
                  <Skeleton circle width={35} height={35} />
                  <div style={{ marginLeft: '10px' }}>
                    <Skeleton width={50} height={10} />
                    <Skeleton
                      width={90}
                      height={10}
                      style={{ marginTop: '5px' }}
                    />
                  </div>
                </div>
              )}
            </div>
            {!isSmallScreen && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton circle width={35} height={35} />
                <div style={{ marginLeft: '10px' }}>
                  <Skeleton width={50} height={10} />
                  <Skeleton
                    width={90}
                    height={10}
                    style={{ marginTop: '5px' }}
                  />
                </div>
              </div>
            )}
            <div
              style={{
                marginLeft: isSmallScreen ? '2px' : '0px',
              }}
            >
              <Skeleton width={50} height={10} />
              <Skeleton width={90} height={10} style={{ marginTop: '5px' }} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default TransactionSkeleton;
