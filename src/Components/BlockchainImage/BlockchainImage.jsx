import React from 'react';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';
import polygon from '../../assets/images/svg/crypto-icons/polygon.webp';
import bnb from '../../assets/images/svg/crypto-icons/bnb.svg';
import optimism from '../../assets/images/svg/crypto-icons/optimism-seeklogo.png';
import btcMainnet from '../../assets/images/svg/crypto-icons/btc-mainnet.svg';
import cronos from '../../assets/images/svg/crypto-icons/cronos.svg';

import baseMiannet from '../../assets/images/svg/crypto-icons/base-mainnet.png';
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
    bnb: bnb,
    optimism: optimism,
    btc: btcMainnet,
    base: baseMiannet,
    cronos: cronos,
  };

  const imageSrc = images[blockchainType?.toLowerCase()];

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
