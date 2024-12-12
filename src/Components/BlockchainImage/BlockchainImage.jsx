import React from 'react';

import { BlockchainMetadata } from '../../common/constants';
import { capitalizeFirstLetter } from '../../utils/utils';

const BlockchainImage = ({
  blockchainType,
  width,
  height,
  className,
  style,
}) => {
  const image = BlockchainMetadata[blockchainType?.toLowerCase()]?.icon;

  if (!image) {
    return null;
  }

  return (
    <img
      src={image}
      width={width}
      height={height}
      className={className}
      style={{ ...style, borderRadius: '3px' }}
      alt={capitalizeFirstLetter(blockchainType)}
    />
  );
};

export default BlockchainImage;
