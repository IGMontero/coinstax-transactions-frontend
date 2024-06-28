import React, { useState } from 'react';
import { copyToClipboard, formatIdTransaction } from '../../../utils/utils';
import { Link } from 'react-router-dom';

const Explorers = ({ platforms }) => {
  const [copiedKey, setCopiedKey] = useState(null);
  const explorerData = [
    {
      image: 'https://chain-icons.s3.amazonaws.com/zora',
      name: 'Zora',
      key: 'zora',
      base_url: 'https://zora.co/',
    },

    {
      image: 'https://chain-icons.s3.amazonaws.com/scroll.png',
      name: 'Scroll',
      key: 'scroll',
      base_url: 'https://scrollscan.com/token',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/polygon.png',
      name: 'Polygon',
      key: 'polygon-pos',
      base_url: 'https://polygonscan.com/address/',
    },
    {
      name: 'Polygon zkevm',
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/1101',
      key: 'polygon-zkevm',
      base_url: 'https://zkevm.polygonscan.com/token',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/optimism.png',
      name: 'Optimism',
      key: 'optimism',
      base_url: 'https://optimistic.etherscan.io/token',
    },
    {
      name: 'zkSync Era',
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/324',
      key: 'zksync',
      base_url: 'https://era.zksync.network/',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/59144',
      name: 'Linea',
      key: 'linea',
      base_url: 'https://lineascan.build/token/',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/ethereum.png',
      name: 'Ethereum',
      key: 'ethereum',
      base_url: 'https://etherscan.io/token',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/81457',
      name: 'Blast',
      key: 'blast',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/8453',
      name: 'Base',
      key: 'base',
      base_url: 'https://basescan.org/token',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/aurora.png',
      name: 'Aurora',
      key: 'aurora',
      base_url: 'https://explorer.aurora.dev/token',
    },
    {
      name: 'Tron',
      image: 'https://cdn-icons-png.flaticon.com/512/7016/7016547.png',
      key: 'tron',
      // base_url: 'https://tronscan.org/#/token/',
    },
    {
      name: 'Open Network',
      image:
        'https://seeklogo.com/images/T/telegram-open-network-logo-FB68300089-seeklogo.com.png',
      key: 'the-open-network',
    },
    {
      name: 'Solana',
      image: 'https://chain-icons.s3.amazonaws.com/solana.png',
      key: 'solana',
      base_url: 'https://explorer.solana.com/address/',
    },
    {
      name: 'Near Protocol',
      image:
        'https://static.vecteezy.com/system/resources/thumbnails/024/093/143/small_2x/near-protocol-near-glass-crypto-coin-3d-illustration-free-png.png',
      key: 'near-protocol',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/3776',
      name: 'Astar',
      key: 'astar',
      // base_url: '',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/arbitrum.png',
      name: 'Arbitrum',
      key: 'arbitrum',
      base_url: 'https://arbiscan.io/token',
    },
    {
      name: 'BNB Chain',
      image: 'https://chain-icons.s3.amazonaws.com/bsc.png',
      key: 'binance-smart-chain',
      base_url: 'https://bscscan.com/token',
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

      key: 'arbitrum',
      base_url: 'https://arbiscan.io/token',
    },
    {
      name: 'Avalanche',
      image: 'https://chain-icons.s3.amazonaws.com/avalanche.png',
      key: 'avalanche',
      base_url: 'https://snowscan.xyz/token',
    },
    {
      name: 'Celo',
      image: 'https://chain-icons.s3.amazonaws.com/chainlist/42220',
      key: 'celo',
      base_url: 'https://celoscan.io/token',
    },
    {
      name: 'Kava',
      image:
        'https://research.binance.com/static/images/projects/kava/logo.png',
      key: 'kava',
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
          if (!explorer || !explorer.base_url) return null;

          return (
            <Link
              key={index}
              className="mb-4 me-3"
              style={{
                minWidth: 180,
                overflow: 'hidden',
                textDecoration: 'none',
              }}
              to={explorer.base_url ? `${explorer.base_url}/${address}` : '#'}
              target={explorer.base_url ? '_blank' : '_self'}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Explorers;
