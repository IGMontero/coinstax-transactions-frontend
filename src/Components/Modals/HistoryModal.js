import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  UncontrolledPopover,
  PopoverBody,
} from 'reactstrap';
import {
  CurrencyUSD,
  copyToClipboard,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../utils/utils';
import eth from '../../assets/images/svg/crypto-icons/eth.svg';

const HistoryModal = ({ isOpen, toggle, selectedItem }) => {
  const txHashExample =
    '0xd4a4cb2429d24bf0b6128211b24c99e885d506015cabc05186b3debaed002b63';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyValue = (e, value) => {
    if (value) {
      e.stopPropagation();
      copyToClipboard(value);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const renderAction = (action) => {
    const textAction = action === 'Receive' ? 'From' : 'To';

    return (
      <div className="py-3 border-bottom d-flex justify-content-between ">
        <p className="mb-0">{textAction}</p>
        <p className="mb-0">
          {' '}
          {action === 'Receive' ? selectedItem.from : selectedItem.to}
        </p>
      </div>
    );
  };

  if (!selectedItem) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader
        toggle={toggle}
        className="d-flex justify-content-center text-center align-items-center mb-n1"
      >
        {selectedItem.action} Ethereum
      </ModalHeader>
      <hr />
      <ModalBody className="px-5">
        <div className="d-flex  flex-column p-2">
          <div>
            <p className="border-bottom text-muted  pb-0">
              {selectedItem.action}
            </p>
            <div className="d-flex align-items-center">
              <div className="me-2">
                <img src={eth} alt="Ethereum" height={45} width={45} />
              </div>
              <div className="d-flex flex-column">
                <h5 className="mb-0">{selectedItem.amount}</h5>
                <h6 className="mb-0 text-muted">
                  {parseValuesToLocale(selectedItem.valueUSD, CurrencyUSD)}
                </h6>
              </div>
            </div>
          </div>

          <p className="border-bottom text-muted mt-4  pb-0"> Details</p>
          <div className=" border-bottom d-flex justify-content-between">
            <div className="d-flex py-3 pt-0 flex-column">
              <p className="mb-0">{selectedItem.action}</p>
              <p className="mb-0 text-muted">
                {selectedItem.date} {selectedItem.time}
              </p>
            </div>
            <div>
              <p className="mb-0">{selectedItem.amount}</p>
              <p className="text-muted">
                {' '}
                {parseValuesToLocale(selectedItem.valueUSD, CurrencyUSD)}
              </p>
            </div>
          </div>

          {renderAction(selectedItem.action)}

          <div className="py-3 border-bottom d-flex justify-content-between ">
            <p className="mb-0">Network</p>
            <p className="mb-0">{selectedItem.network || 'Ethereum'}</p>
          </div>
          {/* {selectedItem.fee ? ( */}
          <div className=" border-bottom d-flex align-items-center py-2 justify-content-between">
            <div className="d-flex py-3 pt-0 flex-column">
              <p className="mb-0">Fee</p>
            </div>
            <div>
              <p className="mb-0">{selectedItem.amount}</p>
              <p className="text-muted mb-0">
                {' '}
                {parseValuesToLocale(selectedItem.valueUSD, CurrencyUSD)}
              </p>
            </div>
          </div>
          {/* ) : null} */}
          <div className="py-3 d-flex justify-content-between ">
            <p className="mb-0">Hash</p>
            <p
              onClick={(e) => {
                handleCopyValue(e, txHashExample);
              }}
              id="hash"
              className="mb-0 d-flex align-items-center cursor-pointer"
            >
              {selectedItem.hash || formatIdTransaction(txHashExample, 6, 4)}
              <i className="ri-arrow-right-up-line fs-5 ms-1 text-primary"></i>
            </p>
            <UncontrolledTooltip
              placement="bottom"
              target="hash"
              trigger="hover"
            >
              {isCopied ? 'Copied' : txHashExample}
            </UncontrolledTooltip>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default HistoryModal;
