import React, { useState } from 'react';
import { copyToClipboard, getActionMapping } from '../../../../utils/utils';
import { Col, Row, Collapse, CardBody, Badge } from 'reactstrap';

import eth from '../../../../assets/images/svg/crypto-icons/eth.svg';
import ListTransactions from './ListTransactions';
import Negativeledgers from './Ledgers/Negativeledgers';
import PositiveLedgers from './Ledgers/PositiveLedgers';
import InformationLedger from './Ledgers/InformationLedger';
import Thirdcolumn from './Thirdcolumn';

const RenderTransactions = ({ date, transactions, onRefresh }) => {
  const [openCollapse, setopenCollapse] = useState(new Set());

  const [copiedIndex, setCopiedIndex] = useState(null);

  const toggleCollapse = (id) => {
    setopenCollapse((prevopenCollapse) => {
      const newopenCollapse = new Set(prevopenCollapse);
      if (newopenCollapse.has(id)) {
        newopenCollapse.delete(id);
      } else {
        newopenCollapse.add(id);
      }
      return newopenCollapse;
    });
  };

  const handleCopy = async (e, text, index) => {
    e.stopPropagation();
    try {
      copyToClipboard(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  function capitalizeFirstLetter(text) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  return (
    <React.Fragment>
      <Col
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="d-flex justify-content-start pt-4   align-items-center"
      >
        <div className="d-flex justify-content-start ps-2 align-items-center border-bottom w-100">
          <h6 className="fw-semibold text-start mb-3">{date}</h6>
        </div>
      </Col>
      {transactions.map((transaction, index) => {
        const collapseId = `${date}-${index}`;
        if (!transaction.ledgers) {
          return null;
        }
        const sentTxSummary = transaction;

        const receivedTxSummary = transaction;
        const hasList =
          transaction.txSummary?.receivedAssetsCount > 1 ||
          transaction.txSummary?.sentAssetsCount > 1;
        return (
          <div key={transaction.txHash} className="align-items-center">
            <div
              className={` border-bottom bg-transparent px-0 ${openCollapse.has(collapseId)
                  ? 'border border-primary rounded mb-2'
                  : 'bg-light'
                }`}
            >
              <Row
                className={`align-items-center justify-content-between col-12`}
                onClick={() => toggleCollapse(collapseId)}
                style={{
                  cursor: 'pointer',
                  padding: '.7rem',
                  paddingRight: '1rem',
                }}
              >
                {' '}
                <Col
                  lg={3}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                >
                  {transaction.blockchainAction && (
                    <span
                      className={`rounded-circle position-relative align-items-center border me-3 d-flex justify-content-center border-${getActionMapping(transaction.blockchainAction).color
                        } text-${getActionMapping(transaction.blockchainAction).color
                        }`}
                      style={{
                        width: '35px',
                        minWidth: '35px',
                        height: '35px',
                        minHeight: '35px',
                      }}
                    >
                      <i
                        className={`${getActionMapping(transaction.blockchainAction).icon
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

                  <div className="d-flex flex-column text-start justify-content-end">
                    <h6 className="fw-semibold my-0 fs-8">
                      {' '}
                      {capitalizeFirstLetter(transaction.blockchainAction)}
                    </h6>
                    <p className="text-start my-0">
                      {formatTime(transaction.date)}
                    </p>
                  </div>
                  <div className="ms-3">
                    {' '}
                    {transaction.successful &&
                      transaction.successful === true ? (
                      ''
                    ) : (
                      <Badge color="soft-danger" className="rounded-pill">
                        <div className="text-danger fw-normal p-0 d-flex align-items-center">
                          <i className="ri-close-line px-0  fs-5  p-0"></i>{' '}
                          <span className="fs-6"> Failed</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </Col>
                {/* NEGATIVE LEDGERS  || SENT TXSUMMARY */}
                <Col
                  lg={transaction.txSummary.sent ? 3 : 0}
                  md={transaction.txSummary.sent ? 3 : 0}
                  sm={6}
                  xs={6}
                  className={`mb-lg-0 mb-3 ${transaction.txSummary.sent
                      ? 'd-flex justify-content-start '
                      : 'd-none'
                    }`}
                >
                  <Negativeledgers ledger={sentTxSummary} />
                </Col>
                {/* POSITIVE LEDGERS || RECEIVED TXSUMMARY  */}
                <Col
                  lg={transaction.txSummary.sent ? 4 : 7}
                  md={transaction.txSummary.sent ? 4 : 7}
                  sm={transaction.txSummary.sent ? 6 : 12}
                  xs={transaction.txSummary.sent ? 6 : 12}
                  className={`d-flex justify-content-start d-flex  mb-lg-0 mb-3`}
                >
                  <PositiveLedgers
                    ledger={receivedTxSummary}
                    negativeLedgers={sentTxSummary.txSummary.sent}
                  />
                </Col>
                <Col
                  lg={2}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex justify-content-end  align-items-center  mt-lg-0 mt-3"
                >
                  <Thirdcolumn
                    transaction={transaction}
                    index={index}
                    onRefresh={onRefresh}
                  />
                </Col>
              </Row>
              <Collapse isOpen={openCollapse.has(collapseId)}>
                <CardBody
                  onClick={() => toggleCollapse(collapseId)}
                  className={`cursor-pointer ${openCollapse === index ? 'border-info' : ''
                    }`}
                >
                  {/* CODE FOR LIST */}
                  {hasList && <ListTransactions transactions={transaction} />}

                  {/* HASH AND FEE  */}
                  <InformationLedger
                    transaction={transaction}
                    onCopy={handleCopy}
                    collapseId={collapseId}
                    copiedIndex={copiedIndex}
                  />
                </CardBody>
              </Collapse>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default RenderTransactions;
