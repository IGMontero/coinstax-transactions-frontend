import React, { useState, useEffect } from 'react';
import { formatIdTransaction, getActionMapping } from '../../../../utils/utils';
import {
  Col,
  Row,
  Collapse,
  CardBody,
  Badge,
  UncontrolledPopover,
  PopoverBody,
} from 'reactstrap';

import eth from '../../../../assets/images/svg/crypto-icons/eth.svg';
import ListTransactions from './ListTransactions';
import { blockchainActions } from '../../../../utils/utils';
import Negativeledgers from './Ledgers/Negativeledgers';
import PositiveLedgers from './Ledgers/PositiveLedgers';
import InformationLedger from './Ledgers/InformationLedger';
import { Link } from 'react-router-dom';

const RenderTransactions = ({ date, transactions }) => {
  const [openCollapse, setopenCollapse] = useState(new Set());

  const [copiedIndex, setCopiedIndex] = useState(null);

  const [copiedIndex2, setCopiedIndex2] = useState(null);

  const handleCopyToClipboard = async (e, text, index) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex2(index);
      setTimeout(() => {
        setCopiedIndex2(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

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
      await navigator.clipboard.writeText(text);
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

        const isRecived = transaction.txSummary.sent;

        const receivedTxSummary = transaction;
        const hasList =
          transaction.txSummary?.receivedAssetsCount > 1 ||
          transaction.txSummary?.sentAssetsCount > 1;
        return (
          <div key={index} className="align-items-center">
            <div
              className={` border-bottom bg-transparent px-0 ${
                openCollapse.has(collapseId)
                  ? 'border border-primary rounded mb-2'
                  : 'bg-light'
              }`}
            >
              <Row
                className={`align-items-center justify-content-between col-12`}
                onClick={() => toggleCollapse(collapseId)}
                style={{ cursor: 'pointer', padding: '.7rem' }}
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
                      className={`rounded-circle position-relative align-items-center border me-3 d-flex justify-content-center border-${
                        getActionMapping(transaction.blockchainAction).color
                      } text-${
                        getActionMapping(transaction.blockchainAction).color
                      }`}
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
                  xs={6}
                  className={`mb-lg-0 mb-3 ${
                    transaction.txSummary.sent
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
                  xs={6}
                  className={`d-flex justify-content-start d-flex  mb-lg-0 mb-3 ${
                    transaction.txSummary.sent ? '' : 'ms-n2'
                  }`}
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
                  className="d-flex justify-content-start me-n4 align-items-center  mt-lg-0 mt-3"
                >
                  <div className="d-flex flex-column text-start">
                    <p className="text-start my-0">
                      {' '}
                      {transaction.blockchainAction ===
                      blockchainActions.RECEIVE
                        ? 'From'
                        : transaction.blockchainAction ===
                            blockchainActions.SEND
                          ? 'To'
                          : 'Aplication'}
                    </p>
                    <h6 className="fw-semibold my-0 text-start d-flex align-items-center">
                      {transaction.txSummary.marketplaceName ? (
                        <span
                          className="text-decoration-none"
                          onClick={(e) => {
                            handleCopyToClipboard(
                              e,
                              transaction.recipient,
                              index,
                            );
                          }}
                        >
                          <span className="text-hover-underline">
                            {copiedIndex2 === index ? (
                              <span className="text-dark">Copied!</span>
                            ) : transaction.txSummary.marketplaceName !== '' ? (
                              <div className="d-flex align-items-center ">
                                <img
                                  src={transaction.txSummary.marketplaceLogo}
                                  alt={transaction.txSummary.marketplaceName}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '10px',
                                    marginRight: '10px',
                                  }}
                                />
                                {transaction.txSummary.marketplaceName}
                              </div>
                            ) : (
                              formatIdTransaction(transaction.recipient, 4, 4)
                            )}
                          </span>
                        </span>
                      ) : (
                        <>
                          {transaction.blockchainAction ===
                          blockchainActions.RECEIVE ? (
                            <>
                              <Link
                                target="_blank"
                                className="text-decoration-none"
                                to={`https://etherscan.io/address/${transaction.sender}`}
                              >
                                <span className="text-hover-underline">
                                  {formatIdTransaction(
                                    transaction.sender,
                                    4,
                                    4,
                                  )}
                                </span>
                              </Link>
                              <i className="ri-arrow-right-up-line fs-5 text-muted ms-1"></i>
                            </>
                          ) : transaction.blockchainAction ===
                            blockchainActions.SEND ? (
                            <>
                              <Link
                                target="_blank"
                                className="text-decoration-none"
                                to={`https://etherscan.io/address/${transaction.recipient}`}
                              >
                                <span className="text-hover-underline">
                                  {formatIdTransaction(
                                    transaction.recipient,
                                    4,
                                    4,
                                  )}
                                </span>
                              </Link>
                              <i className="ri-arrow-right-up-line fs-5 text-muted ms-1"></i>
                            </>
                          ) : (
                            <span
                              className="text-decoration-none"
                              onClick={(e) => {
                                handleCopyToClipboard(
                                  e,
                                  transaction.recipient,
                                  index,
                                );
                              }}
                            >
                              <span className="text-hover-underline">
                                {copiedIndex2 === index ? (
                                  <span className="text-dark">Copied!</span>
                                ) : (
                                  formatIdTransaction(
                                    transaction.recipient,
                                    4,
                                    4,
                                  )
                                )}
                              </span>
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                </Col>
              </Row>
              <Collapse isOpen={openCollapse.has(collapseId)}>
                <CardBody
                  onClick={() => toggleCollapse(collapseId)}
                  className={`cursor-pointer ${
                    openCollapse === index ? 'border-info' : ''
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
