import React, { useState, useEffect } from 'react';
import { Col, PopoverBody, Row, UncontrolledPopover } from 'reactstrap';
import {
  copyToClipboard,
  formatNumber,
  parseValuesToLocale,
} from '../../../../../utils/utils';
import { useNavigate } from 'react-router-dom';

const ListTransactionss = ({ transactions }) => {
  const navigate = useNavigate();
  const [positiveLedgers, setPositiveLedgers] = useState([]);
  const [negativeLedgers, setNegativeLedgers] = useState([]);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyValue = (e, text) => {
    e.stopPropagation();
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

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

  function renderLedger(ledger, index, isReceived) {
    const isNft = ledger.isNft;
    const prefix = isReceived ? 'received' : 'sent';
    const targetId = `amount-list-${prefix}-${index}-${transactions.txHash}`;

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
            {isNft && (ledger.amount === 1 || ledger.amount === -1) ? (
              <span
                onClick={() => {
                  if (
                    ledger.txInfo?.contractAddressInfo?.address &&
                    ledger.txInfo?.tokenId
                  ) {
                    navigate(
                      `/contract/${ledger.txInfo.contractAddressInfo.address}/?tokenId=${ledger.txInfo.tokenId}`,
                    );
                  }
                }}
                className="text-displayList text-hover-underline text-hover-primary"
              >
                {ledger.currency}
              </span>
            ) : (
              <>
                {ledger.amount > 0 ? '+' : ''}
                <span
                  id={targetId}
                  onClick={(e) => handleCopyValue(e, ledger.amount)}
                >
                  {parseValuesToLocale(
                    ledger.amount,
                    isNft ? '' : ledger.currency,
                  )}
                </span>
                {ledger.amount && (
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
                        {isCopied ? 'Copied' : ledger.amount}
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover>
                )}
              </>
            )}
            {/* {!ledger.isNft && ledger.currency} */}
          </h6>
          {!ledger.isNft && (
            <p className="text-muted mb-0 d-flex align-items-center">
              {ledger.prettyNativeAmount || (
                <>
                  {/* N/A
                  <i
                    id={`nativeAmount-na-${targetId}`}
                    className="ri-information-line ms-1 fs-6 text-muted"
                  ></i>
                  <UncontrolledPopover
                    onClick={(e) => e.stopPropagation()}
                    placement="bottom"
                    target={`nativeAmount-na-${targetId}`}
                    trigger="hover"
                  >
                    <PopoverBody
                      style={{
                        width: 'auto',
                      }}
                      className="w-auto p-2 text-center"
                    >
                      <span
                        style={{
                          fontSize: '0.70rem',
                        }}
                      >
                        The price is not available at the time of the
                        transaction
                      </span>
                    </PopoverBody>
                  </UncontrolledPopover> */}{' '}
                  {null}
                </>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  function getColSizeBasedOnContent(ledgers) {
    const maxLength = Math.max(
      ...ledgers.map((ledger) => ledger?.currency?.length),
    );

    if (maxLength > 10) {
      return {
        negative: 'col-xxl-4 col-lg-4',
        positive: 'col-xxl-8 col-lg-8',
      };
    } else {
      return {
        negative: 'col-xxl-3 col-lg-3',
        positive: 'col-xxl-7 col-lg-7',
      };
    }
  }

  const negativeLedgersSize = getColSizeBasedOnContent(negativeLedgers);
  const positiveLedgersSize = getColSizeBasedOnContent(positiveLedgers);

  return (
    <Col xxl={12} lg={12} className="border-top ">
      <Row className=" g-0 mt-2">
        <Col xxl={12} className="d-flex mb-2"></Col>
        {negativeLedgers && negativeLedgers.length > 0 && (
          <Col
            className={`d-flex align-items-start flex-column ps-2 ${negativeLedgersSize.negative}`}
          >
            <span className=" mt-n2">Sent</span>
            {negativeLedgers.map((ledger, index) =>
              renderLedger(ledger, index, false),
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
            className={`d-flex align-items-center ps-2 flex-column justify-content-start ${positiveLedgersSize.positive}`}
          >
            <span className="mb-0 mt-n2 align-self-start">Received</span>
            <div className="w-100">
              {positiveLedgers.map((ledger, index) =>
                renderLedger(ledger, index, true),
              )}
            </div>
          </Col>
        )}
      </Row>
    </Col>
  );
};

export default ListTransactionss;
