import React from 'react';
import { Col, Row, PopoverBody, UncontrolledPopover } from 'reactstrap';
import {
  formatIdTransaction,
  blockchainActions,
} from '../../../../../utils/utils';
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

  const posLedgers = transaction.ledgers.filter(
    (ledger) => !ledger.isFee && ledger.amount > 0,
  );

  const removeLeadingMinus = (fee) => {
    const feeStr = String(fee);
    if (feeStr.startsWith('-')) {
      return parseFloat(feeStr.slice(1));
    }
    return parseFloat(feeStr);
  };

  return (
    <Col lg={12}>
      <Row className="d-flex flex-row align-items-center">
        <Col lg={12} className="p-2 d-flex ">
          {transaction.txSummary?.collectionName && (
            <div className="p-2 mx-2 d-flex flex-column align-items-center">
              <strong className="mb-1">Collection:</strong>
              <span className="d-flex align-items-center">
                {transaction.txSummary.collectionName
                  ? transaction.txSummary?.collectionName
                  : '0'}
                <i
                  id={`collection-id-${transaction.blockHash}`}
                  class="ri-information-line ms-2 fs-5 mb-text-muted"
                ></i>
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
                      {transaction.txSummary.allCollectionNames.length &&
                        transaction.txSummary.allCollectionNames.map(
                          (ledger, index) => (
                            <div key={index}>
                              <li>{ledger}</li>
                            </div>
                          ),
                        )}
                    </span>
                  </PopoverBody>
                </UncontrolledPopover>
              </span>
            </div>
          )}

          <div className="p-2 mx-2 d-flex flex-column">
            <strong className="mb-1">Fee:</strong>
            <span>
              {transaction.blockchainAction === blockchainActions.RECEIVE
                ? 'N/A'
                : transaction.txSummary &&
                    transaction.txSummary.fee &&
                    transaction.txSummary.fee.prettyAmount !== '0' &&
                    transaction.txSummary.fee.prettyAmount !== null
                  ? `${transaction.txSummary.fee.prettyAmount} (${transaction.txSummary.fee.prettyNativeAmount})`
                  : 'N/A'}

              {/* {transaction.blockchainAction === blockchainActions.RECEIVE
                ? "N/A"
                : transaction.ledgers &&
                  transaction.ledgers.find((ledger) => ledger.isFee)
                ? formatNumber(
                    removeLeadingMinus(
                      transaction.ledgers.find((ledger) => ledger.isFee).amount
                    )
                  ) +
                  ` ${transaction.feeCurrency} ($${removeLeadingMinus(
                    transaction.ledgers.find((ledger) => ledger.isFee)
                      .nativeamount
                  ).toFixed(2)})`
                : "0.00"} */}
            </span>
          </div>

          <div className="align-items-center d-flex">
            <div className="p-2 d-flex flex-column">
              <strong>Transaction Hash:</strong>
              <div className="d-flex">
                <span className="ms-1d -flex align-items-center ">
                  {transaction.txHash ? (
                    <Link
                      to={`https://etherscan.io/tx/${transaction.txHash}`}
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

            <div>
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
        </Col>
      </Row>
    </Col>
  );
};

export default InformationLedger;
