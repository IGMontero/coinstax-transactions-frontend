import React from 'react';
import { Badge, Col } from 'reactstrap';
import eth from '../../../../../../assets/images/svg/crypto-icons/eth.svg';

import ValueColumn from './ValueColumn';
import { getActionMapping } from '../../../../../../utils/utils';

function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const BlockChainActionColumn = ({ transaction }) => {
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  return (
    <>
      <Col
        className={`d-flex ${
          transaction.successful && !transaction.successful ? 'col-12' : 'col-7'
        }`}
      >
        {transaction.blockchainAction && (
          <span
            className={`rounded-circle position-relative align-items-center border me-3 d-flex justify-content-center border-${
              getActionMapping(transaction.blockchainAction).color
            } text-${getActionMapping(transaction.blockchainAction).color}`}
            style={{
              width: '35px',
              minWidth: '35px',
              height: '35px',
              minHeight: '35px',
            }}
          >
            <i
              className={`${
                getActionMapping(transaction.blockchainAction).icon
              } fs-2`}
            ></i>
            <img
              src={eth}
              alt="Ethereum"
              className="position-absolute"
              style={{
                bottom: '-3px',
                right: '-2px',
                width: '15px',
                height: '15px',
              }}
            />
          </span>
        )}

        <div className="d-flex flex-column text-start ">
          <h6 className="fw-semibold my-0 fs-8">
            {' '}
            {capitalizeFirstLetter(transaction.blockchainAction)}
          </h6>
          <p className="text-start my-0">{formatTime(transaction.date)}</p>
        </div>
      </Col>
      <Col className=" w-100">
        {transaction.successful ? (
          transaction.txSummary.value && (
            <div className="d-flex text-start justify-content-start ms-n2">
              <ValueColumn transaction={transaction} />
            </div>
          )
        ) : (
          <div className="ms-n2">
            <Badge color="soft-danger" className="rounded-pill">
              <div className="text-danger fw-normal p-0 d-flex align-items-center">
                <i className="ri-close-line px-0 fs-5 p-0"></i>
                <span className="fs-6"> Failed</span>
              </div>
            </Badge>
          </div>
        )}
      </Col>{' '}
    </>
  );
};

export default BlockChainActionColumn;
