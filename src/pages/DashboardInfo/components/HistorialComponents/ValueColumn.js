import React from 'react';

const ValueColumn = ({ value }) => {
  return (
    <div className="d-flex  flex-column w-100 ">
      <p
        style={{ fontSize: '12px', marginBottom: '4px' }}
        className="text-start  mb-0"
      >
        Value
      </p>
      <div className="d-flex align-items-end ">
        <h6 className="fw-semibold d-flex mb-0 mt-0 text-start d-flex align-items-center text-contractLabel">
          {value ? value : ''}
        </h6>
      </div>
    </div>
  );
};

export default ValueColumn;
