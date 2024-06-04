import React from 'react';

const ChartSkeleton = () => {
  const data = [
    100, 120, 130, 140, 160, 90, 110, 60, 80, 50, 70, 100, 50, 120, 90, 120,
    110, 50, 90, 110, 110, 135, 105, 145, 115, 85, 125, 145, 165, 185, 105, 125,
    145, 165, 185, 205, 225, 245, 265, 285, 305, 325, 345, 365, 385, 405, 425,
    445,
  ];
  const height = 300;
  const points = data.map((value, index) => `${index * 30},${value}`).join(' ');

  const polygonPoints =
    `0,${height} ` + points + ` ${data.length * 30},${height}`;

  return (
    <div className="loading2">
      <svg
        height={height}
        width="950px"
        style={{
          animation: 'fadeInOut 1s ease-in-out infinite',
          maxWidth: 1250,
          width: '100%',
          marginTop: '40px',
        }}
      >
        <polygon
          points={polygonPoints}
          fill="rgba(128, 128, 128, 0.3)"
          stroke="none"
        />
        <polyline id="back" points={points}></polyline>
        <polyline id="front" points={points}></polyline>
      </svg>
    </div>
  );
};

export default ChartSkeleton;
