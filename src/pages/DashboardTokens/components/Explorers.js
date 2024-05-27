import React from 'react';
import { Col, Row, Button, Badge } from 'reactstrap';
import { formatIdTransaction } from '../../../utils/utils';

const Explorers = ({ platforms }) => {
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
  ];

  const normalizeName = (name) => {
    return name.toLowerCase().replace(/[\s-]/g, ' ');
  };
  const exceptionMap = {
    'polygon pos': 'polygon',
    'binance smart chain': 'binance',
    ethereum: 'ethereum',
    binance: 'binance',
    'optimistic ethereum': 'optimism',
    'zk rollup': 'zkSync',
    'zk rollups': 'zkSync',
    'zk rollup era': 'zkSync',
  };
  const findExplorer = (platformName) => {
    const normalizedName = normalizeName(platformName);
    // Primero verifica si hay una excepción definida
    const mappedName = exceptionMap[normalizedName] || normalizedName;

    return explorerData.find(({ name }) =>
      normalizeName(name).includes(mappedName),
    );
  };

  return (
    <div className="mb-3 border-bottom pb-5">
      <div className="my-5">
        <h3>Explorers</h3>
      </div>
      <div className="d-flex flex-wrap">
        {Object.entries(platforms).map(([key, address], index) => {
          const explorer = findExplorer(key);
          if (!explorer) return null;

          return (
            <Col key={index} md={2} className="mb-4 me-2">
              <div className="w-100 p-1 border borde-1 rounded d-flex align-items-center justify-content-start text-left">
                <img
                  src={explorer.image}
                  alt={explorer.name}
                  style={{ width: 30, height: 30 }}
                  className="me-2"
                />
                <div>
                  <div>{explorer.name}</div>
                  <small className="text-muted">
                    {formatIdTransaction(address, 4, 6)}
                  </small>
                </div>
              </div>
            </Col>
          );
        })}
      </div>
    </div>
  );
};

export default Explorers;
