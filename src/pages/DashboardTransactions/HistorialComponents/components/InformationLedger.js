import React from 'react';
import { Col, Row, PopoverBody, UncontrolledPopover } from 'reactstrap';
import {
  formatIdTransaction,
  blockchainActions,
  parseValuesToLocale,
  removeNegativeSign,
} from '../../../../utils/utils';
import { Link } from 'react-router-dom';

const InformationLedger = ({
  transaction,
  onCopy,
  collapseId,
  copiedIndex,
}) => {
  const handleCopy = (e) => {
    onCopy(e, transaction.txHash, collapseId);
  };

  const renderCollectionName = (collectionName) => {
    if (collectionName) {
      return (
        <div className="p-2 me-2 d-flex align-items-center">
          <span className="d-flex align-items-center">
            <div className="d-flex flex-column">
              <strong className="text-start">Collection:</strong>
              <div id={`collection-id-${transaction.blockHash}`}>
                {collectionName ? collectionName : '0'}
              </div>
            </div>
            {transaction.txSummary.allCollectionNames.length > 1 && (
              <>
                <UncontrolledPopover
                  onClick={(e) => e.stopPropagation()}
                  placement="top"
                  target={`collection-id-${transaction.blockHash}`}
                  trigger="hover"
                >
                  <PopoverBody className="p-2">
                    <span
                      style={{
                        fontSize: '0.70rem',
                      }}
                    >
                      {transaction.txSummary.allCollectionNames.map(
                        (ledger, index) => (
                          <div key={index}>
                            <li>{ledger}</li>
                          </div>
                        ),
                      )}
                    </span>
                  </PopoverBody>
                </UncontrolledPopover>
              </>
            )}
          </span>
        </div>
      );
    }
  };

  const renderFee = (fee) => {
    const prettyAmount = fee?.prettyAmount;
    const amount = parseValuesToLocale(fee?.amount, '');
    const amountUsd = parseValuesToLocale(
      fee?.nativeAmount,
      fee?.nativeCurrency,
    );

    return (
      <div className=" p-2 d-flex flex-column">
        <strong className="">Fee:</strong>
        <span>
          {transaction.blockchainAction === blockchainActions.RECEIVE
            ? 'N/A'
            : transaction.txSummary && fee && amount !== '0' && amount !== null
              ? `${removeNegativeSign(amount)} ${fee.currency} (${removeNegativeSign(amountUsd)})`
              : 'N/A'}
        </span>
      </div>
    );
  };

  const renderTransactionHash = (transaction) => {
    const blockchainLinks = {
      ethereum: 'https://etherscan.io/tx',
      bnb: 'https://bscscan.com/tx',
      polygon: 'https://polygonscan.com/tx',
      optimism: 'https://optimistic.etherscan.io/tx',
      base: 'https://basescan.org/tx',
      cronos: 'https://cronoscan.com/tx',
    };

    const blockchain = transaction.blockchain;
    const baseLink = blockchainLinks[blockchain];

    return (
      <div className="align-items-center d-flex">
        <div className="p-2 d-flex mx-2 flex-column">
          <strong>Transaction Hash:</strong>
          <div className="d-flex">
            <span
              title={transaction.txHash}
              className=" d-flex align-items-center "
            >
              {transaction.txHash ? (
                <Link
                  to={`${baseLink}/${transaction.txHash}`}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="text-decoration-none text-muted  "
                >
                  {' '}
                  <span className=" text-hover-dark  text-hover-underline">
                    {formatIdTransaction(transaction.txHash, 4, 4)}
                  </span>
                </Link>
              ) : (
                '0'
              )}
              <i className="ri-arrow-right-up-line fs-6"></i>
            </span>
          </div>
        </div>

        <div className="me-3">
          <button
            className="btn btn-light p-0  border-0 "
            onClick={(e) => handleCopy(e, transaction.txHash, collapseId)}
          >
            {copiedIndex === collapseId ? (
              <i className="ri-check-line mx-2 fs-4 text-dark"></i>
            ) : (
              <i className="ri-file-copy-line mx-2 fs-4 text-dark"></i>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Col lg={12} className="ps-1">
      <Row className="d-flex flex-row align-items-center">
        <Col lg={12} className="p-2  d-flex">
          {transaction.txSummary?.collectionName &&
            renderCollectionName(transaction.txSummary.collectionName)}

          {renderFee(transaction.txSummary.fee)}

          {renderTransactionHash(transaction)}
        </Col>
      </Row>
    </Col>
  );
};

export default InformationLedger;
