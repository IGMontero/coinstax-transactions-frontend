import React from 'react';
import { Badge, Col } from 'reactstrap';

import BlockchainImage from '../../../../../Components/BlockchainImage/BlockchainImage';
import { useGetTimezone } from '../../../../../hooks/useUtils';
import { formatTimeForClient } from '../../../../../utils/date.utils';
import { getActionMapping } from '../../../../../utils/utils';
import ValueColumn from './ValueColumn';

function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const BlockChainActionColumn = ({ transaction }) => {
  const timezone = useGetTimezone();

  const formatTime = (dateString) => {
    return formatTimeForClient(dateString, timezone, 'time');

  };




  return (
    <>
      <Col
        className={`d-flex justify-content-start ${transaction.successful && !transaction.successful
          ? 'col-12'
          : 'col-lg-6 col-xl-6   col-8 '
          }`}
      >
        {transaction.blockchainAction && (
          <span
            className={`rounded-circle position-relative  align-items-center border me-3 d-flex justify-content-center border-${getActionMapping(transaction.blockchainAction).color
              } text-${getActionMapping(transaction.blockchainAction).color}`}
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

            <BlockchainImage
              style={{
                bottom: '-3px',
                right: '-2px',
              }}
              width={15}
              height={15}
              className="position-absolute"
              blockchainType={transaction.blockchain}
            />
          </span>
        )}

        <div className="d-flex flex-column text-start ">
          <h6 className="fw-semibold my-0 fs-8">
            {' '}
            {capitalizeFirstLetter(transaction.blockchainAction)}
          </h6>
          <p className="text-start my-0">{formatTime(transaction.date)}</p>
        </div>
      </Col>
      <Col className="col-4 col-xl-6 col-lg-6 ms-lg-o ms-xl-0 ms-md-3  ms-4 ">
        {transaction.successful ? (
          transaction.txSummary.value && (
            <div className="d-flex text-start justify-content-start ">
              <div
                style={{
                  marginLeft: '1.35rem',
                }}
              >
                {''}
              </div>
              <img
                src=""
                alt=""
                className="rounded  img-transaction"
                width="auto"
                height={35}
              />
              <ValueColumn transaction={transaction} />
            </div>
          )
        ) : (
          <div className="ms-sm-4 ms-3">
            <div
              style={{
                marginLeft: '1.35rem',
              }}
            >
              {''}
            </div>
            <img
              src=""
              alt=""
              className="rounded img-transaction"
              width="auto"
              height={35}
            />
            <Badge color="soft-danger" className="rounded-pill">
              <div className="text-danger fw-normal p-0 d-flex align-items-center">
                <i className="ri-close-line px-0 fs-5 p-0"></i>
                <span className="fs-6"> Failed</span>
              </div>
            </Badge>
          </div>
        )}
      </Col>{' '}
    </>
  );
};

export default BlockChainActionColumn;
