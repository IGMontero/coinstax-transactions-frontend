import React from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import polygon from '../../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../../assets/images/svg/crypto-icons/binanceLogo.png';
import { capitalizeFirstLetter } from '../../utils/utils';

const BlockchainImage = ({
  blockchainType,
  width,
  height,
  className,
  style,
}) => {
  const images = {
    ethereum: eth,
    polygon: polygon,
    'bsc-mainnet': bnb,
  };

  const imageSrc = images[blockchainType.toLowerCase()];

  if (!imageSrc) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      width={width}
      height={height}
      className={className}
      style={style}
      alt={capitalizeFirstLetter(blockchainType)}
    />
  );
};

export default BlockchainImage;
