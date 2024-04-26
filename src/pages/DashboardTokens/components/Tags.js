import React from 'react';

const Tags = () => {
  return (
    <div className=" mb-3 border-bottom pb-5">
      <div className="my-5">
        <h3>Tags</h3>
      </div>
      <div className="d-flex flex-wrap">
        <button className="btn rounded-pill border border align-items-center d-flex btn-sm me-2 p-0 px-2 mt-2">
          <span className="text-primary fs-4 me-2">#</span>{' '}
          <span className="text-dark mb-0 fs-5">Token</span>
        </button>
      </div>
    </div>
  );
};

export default Tags;
