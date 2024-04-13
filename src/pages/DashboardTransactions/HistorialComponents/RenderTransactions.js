import React, { useEffect, useState } from 'react';
import { blockchainActions, copyToClipboard } from '../../../utils/utils';
import { Col, Row, Collapse, CardBody, Badge } from 'reactstrap';

import InformationLedger from './components/InformationLedger';
import ListTransactions from './components/List/ListTransactions';
// Columns components
import ApprovalColumn from './components/Columns/ApprovalColumn';
import SentColumn from './components/Columns/SentColumn';
import ContractInfoColumn from './components/Columns/ContractInfoColumn';
import ReceivedColumn from './components/Columns/ReceivedColumn';
import BlockChainActionColumn from './components/Columns/BlockChainActionColumn';

const RenderTransactions = ({
  date,
  transactions,
  onRefresh,
  setTransactions,
}) => {
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
        const sentTxSummary = transaction.txSummary?.sent;

        const hasList =
          transaction.txSummary?.receivedAssetsCount > 1 ||
          transaction.txSummary?.sentAssetsCount > 1;

        const isApproval =
          transaction.txSummary?.approval && blockchainActions.APPROVE;
        return (
          <div key={transaction.txHash} className="align-items-center">
            <div
              className={` border-bottom bg-transparent px-0 ${
                openCollapse.has(collapseId)
                  ? 'border border-primary rounded px-2 mb-2'
                  : 'bg-light'
              }`}
              style={{
                transition: `all 0.3s ease-in-out`,
              }}
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
                {/* BLOCKCHAIN ACTION && VALUE COLUMN */}
                <Col
                  lg={4}
                  md={12}
                  sm={12}
                  xs={12}
                  className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                >
                  <BlockChainActionColumn transaction={transaction} />
                </Col>
                {/* NEGATIVE LEDGERS  || SENT TXSUMMARY */}
                <Col
                  lg={sentTxSummary ? 3 : 0}
                  md={sentTxSummary ? 3 : 0}
                  sm={6}
                  xs={6}
                  className={`mb-lg-0 mb-3 ${
                    sentTxSummary ? 'd-flex justify-content-start ' : 'd-none'
                  }`}
                >
                  <SentColumn ledger={transaction} />
                </Col>
                {/* POSITIVE LEDGERS || RECEIVED TXSUMMARY  */}
                <Col
                  lg={sentTxSummary ? 3 : 6}
                  md={sentTxSummary ? 3 : 6}
                  sm={sentTxSummary ? 6 : 12}
                  xs={sentTxSummary ? 6 : 12}
                  className={`d-flex justify-content-start d-flex  mb-lg-0 mb-3`}
                >
                  {isApproval ? (
                    <ApprovalColumn transaction={transaction} />
                  ) : (
                    <ReceivedColumn
                      isApproval={isApproval}
                      ledger={transaction}
                      negativeLedgers={sentTxSummary}
                    />
                  )}
                </Col>
                <Col
                  lg={2}
                  md={3}
                  sm={3}
                  xs={3}
                  className="d-flex justify-content-end  align-items-center  pb-lg-0 pb-3"
                >
                  {transaction.blockchainAction === blockchainActions.BURN ||
                  transactions.blockchainAction === blockchainActions.MINT ||
                  transaction.blockchainAction ===
                    blockchainActions.OTHER ? null : (
                    <ContractInfoColumn
                      transaction={transaction}
                      index={index}
                      onRefresh={onRefresh}
                      setTransactions={setTransactions}
                    />
                  )}
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
