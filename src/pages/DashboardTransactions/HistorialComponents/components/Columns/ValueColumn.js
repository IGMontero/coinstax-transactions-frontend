import React from 'react';
import { CurrencyUSD, parseValuesToLocale } from '../../../../../utils/utils';

const ValueColumn = ({ transaction }) => {
  const parseValue = parseValuesToLocale(
    Math.abs(transaction.value),
    CurrencyUSD,
  );

  return (
    <div>
      <p
        style={{ fontSize: '12px', marginBottom: '4px' }}
        className="text-start  mb-0"
      >
        Value
      </p>
      <div className="d-flex align-items-start ">
        <h6 className="fw-semibold d-flex mb-0 mt-0 text-start d-flex align-items-center text-contractLabel">
          {transaction?.value ? `${parseValue}` : ''}
        </h6>
      </div>
    </div>
  );
};

export default ValueColumn;
