import React, { useState } from 'react';
import { copyToClipboard, formatIdTransaction } from '../../../utils/utils';

const Explorers = ({ platforms }) => {
  const [copiedKey, setCopiedKey] = useState(null);
  const explorerData = [
    {
      image: 'https://chain-icons.s3.amazonaws.com/zora',
      name: 'Zora',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/324',
      name: 'zkSync Era',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/scroll.png',
      name: 'Scroll',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/1101',
      name: 'Polygon',
      key: 'polygon-pos',
      base_url: 'https://polygonscan.com/address/',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/optimism.png',
      name: 'Optimism',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/59144',
      name: 'Linea',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/ethereum.png',
      name: 'Ethereum',
      key: 'ethereum',
      base_url: 'https://etherscan.io/address/',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/81457',
      name: 'Blast',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/8453',
      name: 'Base',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/aurora.png',
      name: 'Aurora',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/3776',
      name: 'Astar',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/arbitrum.png',
      name: 'Arbitrum',
    },
    {
      name: 'Binance',
      image: 'https://chain-icons.s3.amazonaws.com/bsc.png',
    },
    {
      name: 'Fantom',
      image: 'https://chain-icons.s3.amazonaws.com/fantom.png',
      key: 'fantom',
      base_url: 'https://ftmscan.com/address/',
    },
    {
      name: 'Arbitrum-one',
      image: 'https://chain-icons.s3.amazonaws.com/arbitrum.png',
    },
    {
      name: 'Avalanche',
      image: 'https://chain-icons.s3.amazonaws.com/avalanche.png',
      key: 'avalanche',
      base_url: 'https://cchain.explorer.avax.network/address/',
    },
    {
      name: 'Celo',
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/42220',
      key: 'celo',
      base_url: 'https://explorer.celo.org/address/',
    },
  ];

  const handleCopy = async (e, text, key) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      copyToClipboard(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="mb-3 border-bottom pb-5">
      <div className="my-5">
        <h3>Explorers</h3>
      </div>
      <div className="d-flex flex-wrap">
        {Object.entries(platforms).map(([key, address], index) => {
          const explorer = explorerData.find(
            ({ key: explorerKey }) => explorerKey === key,
          );
          if (!explorer) return null;

          return (
            <div
              key={index}
              className="mb-4 me-3"
              style={{ cursor: 'pointer', minWidth: 180, overflow: 'hidden' }}
            >
              <div className="w-100 p-1 py-2 border border-1 rounded d-flex align-items-center justify-content-start text-left">
                <img
                  src={explorer.image}
                  alt={explorer.name}
                  style={{ width: 30, height: 30 }}
                  className="mx-2"
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div>{explorer.name}</div>
                      <small
                        onClick={(e) => handleCopy(e, address, key)}
                        className="text-muted d-flex"
                      >
                        {formatIdTransaction(address, 4, 6)}{' '}
                        {copiedKey === key ? (
                          <i className="ri-check-line ms-2"></i>
                        ) : (
                          <i className="ri-file-copy-line ms-2"></i>
                        )}
                      </small>
                    </div>
                    <div className="ms-auto d-flex">
                      <i className="ri-arrow-right-up-line fs-4 pb-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explorers;
