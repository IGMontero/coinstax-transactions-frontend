import React, { useState, useEffect } from 'react';
import { Col, PopoverBody, Row, UncontrolledPopover } from 'reactstrap';

import { useNavigate } from 'react-router-dom';
import LedgerItem from './LedgerItem';
import { getColSizeBasedOnContent } from '../../../../../utils/utils';

const ListTransactions = ({ transaction }) => {
  const [positiveLedgers, setPositiveLedgers] = useState([]);
  const [negativeLedgers, setNegativeLedgers] = useState([]);

  const [isCopied, setIsCopied] = useState(false);

  const isPreview = transaction?.preview;

  useEffect(() => {
    if (transaction && transaction.ledgers) {
      const posLedgers = transaction.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount > 0,
      );
      const negLedgers = transaction.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount < 0,
      );

      setPositiveLedgers(posLedgers);
      setNegativeLedgers(negLedgers);
    }
  }, [transaction]);

  const negativeLedgersSize = getColSizeBasedOnContent(negativeLedgers);
  const positiveLedgersSize = getColSizeBasedOnContent(positiveLedgers);

  // #region RETURN AREA
  return (
    <Col xxl={12} lg={12} className="border-top ">
      <Row className=" g-0 mt-2">
        <Col xxl={12} className="d-flex mb-2"></Col>
        {negativeLedgers && negativeLedgers.length > 0 && (
          <Col
            className={`d-flex align-items-start flex-column ps-2 ${negativeLedgersSize.negative}`}
          >
            <span className=" mt-n2">Sent</span>
            {negativeLedgers.map((ledger, index) => (
              <LedgerItem
                key={index}
                ledger={ledger}
                isPreview={isPreview}
                index={index}
                transaction={transaction}
                isReceived={false}
                isCopied={isCopied}
                setIsCopied={setIsCopied}
              />
            ))}
          </Col>
        )}
        {negativeLedgers.length && positiveLedgers.length ? (
          <Col
            xxl={1}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="d-none d-xxl-flex flex-column align-items-center">
              <div className="bg-dark" style={{ width: 0.5, height: 50 }} />
              <div
                style={{
                  marginTop: '-12px',
                  marginBottom: '-12px',
                }}
              >
                <i className="ri-arrow-right-circle-line text-success fs-1 mb-0 mt-0"></i>
              </div>
              <div className="bg-dark" style={{ width: 0.5, height: 60 }} />
            </div>

            <div className="d-xxl-none d-flex align-items-center flex-row justify-content-center w-100 my-4">
              <div className="bg-dark" style={{ height: 0.5, width: '45%' }} />
              <div
                style={{
                  marginTop: '-12px',
                  marginBottom: '-12px',
                  zIndex: 1,
                }}
              >
                <i className="ri-arrow-down-circle-line text-success fs-1 mb-0 mt-0"></i>
              </div>
              <div className="bg-dark" style={{ height: 0.5, width: '45%' }} />
            </div>
          </Col>
        ) : null}

        {positiveLedgers && positiveLedgers.length > 0 && (
          <Col
            className={`d-flex align-items-center ps-2 flex-column justify-content-start ${positiveLedgersSize.positive}`}
          >
            <span className="mb-0 mt-n2 align-self-start">Received</span>
            <div className="w-100">
              {positiveLedgers.map((ledger, index) => (
                <LedgerItem
                  key={index}
                  ledger={ledger}
                  index={index}
                  isPreview={isPreview}
                  transaction={transaction}
                  isReceived={true}
                  isCopied={isCopied}
                  setIsCopied={setIsCopied}
                />
              ))}
            </div>
          </Col>
        )}
      </Row>
    </Col>
  );
};

export default ListTransactions;
