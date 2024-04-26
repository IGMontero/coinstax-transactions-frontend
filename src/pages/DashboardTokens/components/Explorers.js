import React from 'react';
import { Col } from 'reactstrap';

const Explorers = () => {
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
      name: 'Polygon zkEVM',
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
      name: 'Astar zkEMV',
    },
    {
      image: 'https://chain-icons.s3.amazonaws.com/arbitrum.png',
      name: 'Arbitrum',
    },
  ];
  return (
    <div className=" mb-3 border-bottom pb-5 ">
      <div className="my-5">
        <h3>Explorers</h3>
      </div>
      <div className="d-flex flex-wrap">
        {explorerData.map((explorer, index) => (
          <button
            key={index}
            className="btn  border align-items-center d-flex btn-md me-4 p-2 px-2 my-2"
          >
            <img
              src={explorer.image}
              alt={explorer.name}
              className="icon-md me-2"
            />
            <span className="text-dark ms-auto mb-0 fs-6">{explorer.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Explorers;
