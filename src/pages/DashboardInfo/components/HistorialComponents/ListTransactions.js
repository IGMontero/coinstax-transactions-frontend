import React, { useState, useEffect } from 'react';
import { Col, PopoverBody, Row, UncontrolledPopover } from 'reactstrap';

const ListTransactionss = ({ transactions }) => {
  const [positiveLedgers, setPositiveLedgers] = useState([]);
  const [negativeLedgers, setNegativeLedgers] = useState([]);

  useEffect(() => {
    if (transactions && transactions.ledgers) {
      const posLedgers = transactions.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount > 0,
      );
      const negLedgers = transactions.ledgers.filter(
        (ledger) => !ledger.isFee && ledger.amount < 0,
      );

      setPositiveLedgers(posLedgers);
      setNegativeLedgers(negLedgers);
    }
  }, [transactions]);

  const formatNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
      return 'Invalid Number';
    }

    let formattedNumber = parseFloat(number.toFixed(4));
    return formattedNumber.toString();
  };
  function renderLedger(ledger, index, isReceived) {
    const targetId = `amount-list-${index}-${transactions.txHash}`;
    return (
      <div
        key={index}
        className="d-flex align-items-center mb-2 w-100 ps-2"
        style={{ minHeight: '50px' }}
      >
        <div className="image-container me-2 d-flex align-items-center justify-content-center">
          <img
            src={ledger.txInfo?.logo || ledger.currency}
            alt={ledger.txInfo?.name}
            className="rounded"
            width={35}
            height={35}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const container = e.target.parentNode;
              container.classList.add(
                'd-flex',
                'align-items-center',
                'justify-content-center',
              );
              const textNode = document.createElement('div');
              textNode.textContent = ledger.currency;
              textNode.className = 'currency-placeholder';
              container.appendChild(textNode);
            }}
          />
        </div>
        <div className="d-flex flex-column justify-content-center">
          <h6 className="fw-semibold my-0">
            {!(
              ledger.isNft === true &&
              (ledger.amount === 1 || ledger.amount === -1)
            ) ? (
              <>
                {ledger.amount > 0 ? '+' : ''}
                <span id={targetId}>{ledger.prettyNativeAmount}</span>
                {ledger.nativeamount && (
                  <UncontrolledPopover
                    onClick={(e) => e.stopPropagation()}
                    placement="bottom"
                    target={targetId}
                    trigger="hover"
                  >
                    <PopoverBody
                      style={{ width: 'auto' }}
                      className="text-center w-auto p-2 "
                    >
                      <span style={{ fontSize: '0.70rem' }}>
                        {ledger.nativeamount}
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover>
                )}
              </>
            ) : (
              ''
            )}{' '}
            {ledger.currency}
          </h6>
          {!isReceived && !ledger.isNft && (
            <p className="text-muted mb-0">
              {ledger.prettyNativeAmount || 'N/A'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Col xxl={12} lg={12} className="border-top ">
      <Row className="align-items-start g-0 mt-2">
        <Col xxl={12} className="d-flex mb-2"></Col>
        {negativeLedgers && negativeLedgers.length > 0 && (
          <Col xxl={2} className="d-flex align-items-start flex-column ps-2">
            <span className=" mt-n2">Sent</span>
            {negativeLedgers.map((ledger, index) =>
              renderLedger(ledger, index, true),
            )}
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
            xxl={9}
            className="d-flex align-items-center ps-2 flex-column justify-content-start"
          >
            <span className="mb-0 mt-n2 align-self-start">Received</span>
            <div className="w-100">
              {positiveLedgers.map((ledger, index) =>
                renderLedger(ledger, index, false),
              )}
            </div>
          </Col>
        )}
      </Row>
    </Col>
  );
};

export default ListTransactionss;
