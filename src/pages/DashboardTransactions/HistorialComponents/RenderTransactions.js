import React, { useState } from 'react';
import { Col } from 'reactstrap';
import { copyToClipboard } from '../../../utils/utils';

// Columns components
import TransactionItem from '../TransactionItem';

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
        return <TransactionItem key={transaction.txHash}
          transaction={transaction} index={index} date={date}
          openCollapse={openCollapse} toggleCollapse={toggleCollapse}
          copiedIndex={copiedIndex} handleCopy={handleCopy}
          setTransactions={setTransactions} />;

      })}
    </React.Fragment>
  );
};

export default RenderTransactions;
