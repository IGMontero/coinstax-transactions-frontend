import React from 'react';
import ContentLoader from 'react-content-loader';

const TransactionSkeleton = (props) => {
  // Calculamos los offsets base y las diferencias entre grupos
  const baseY = 95;
  const deltaY = 100;

  return (
    <ContentLoader
      height={1200}
      marginTop={10}
      width="100%"
      backgroundColor="#333"
      foregroundColor="#7f7f7f"
      gradientRatio={0.5}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, index) => {
        const y = baseY + index * deltaY;

        return (
          <React.Fragment key={index}>
            <circle cx="30" cy={y} r="20" />
            <rect x="60" y={y - 16} rx="5" ry="5" width="100" height="12" />
            <rect x="60" y={y + 1} rx="5" ry="5" width="100" height="12" />

            <circle cx="380" cy={y} r="20" />
            <rect x="425" y={y - 16} rx="5" ry="5" width="150" height="12" />
            <rect x="425" y={y + 1} rx="5" ry="5" width="120" height="12" />

            {/* <circle cx="690" cy={y} r="20" />
            <rect x="735" y={y - 16} rx="5" ry="5" width="150" height="12" />
            <rect x="735" y={y + 1} rx="5" ry="5" width="120" height="12" /> */}

            <rect x="1025" y={y - 16} rx="5" ry="5" width="100" height="12" />
            <rect x="1025" y={y + 1} rx="5" ry="5" width="100" height="12" />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
};

export default TransactionSkeleton;
