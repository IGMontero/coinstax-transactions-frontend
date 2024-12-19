import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/utils';

const BlockchainImage = ({
  blockchainType,
  width = 30,
  height = 30,
  className,
  style,
}) => {
  const { chains } = useSelector((state) => state.Common.fixedData);

  const chain = chains?.find((chain) => chain.name === blockchainType);

  const image = useMemo(() => {
    const image = chain?.logoUrl;

    return [image];
  }, [chain]);

  if (!image) {
    return null;
  }

  const colorTheme = chain?.colorTheme;

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width || '20px', // Adjust size as needed
    height: height || '20px', // Adjust size as needed
    borderRadius: '50%', // Circle for 'all', square otherwise
    backgroundColor: colorTheme?.hex || colorTheme?.css_rgb || '#ccc', // Fallback to a default color
    padding: '5px',
    position: 'relative',
    ...style,
  };

  return (
    <div style={wrapperStyle} className={className}>
      <img
        src={image}
        width={width * 0.8}
        height={height * 0.8}
        style={{ borderRadius: '3px' }}
        alt={capitalizeFirstLetter(blockchainType)}
      />
    </div>
  );
};

export default BlockchainImage;
