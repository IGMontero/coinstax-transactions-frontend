import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import QRCode from 'qrcode.react';

const QrModal = ({ showQrModal, toggleQrModal, addressTitle }) => {
  return (
    <Modal isOpen={showQrModal} toggle={toggleQrModal} centered>
      <ModalHeader
        toggle={toggleQrModal}
        className="d-flex justify-content-center text-center align-items-center mb-n1"
      ></ModalHeader>
      <ModalBody className="text-center px-5">
        <div className="mb-4 border-bottom">
          <h3 className="">QR Code</h3>
        </div>
        {/* <p className="fs-5" style={{ color: "#ff9d1c" }}>
          Assets can only be sent within the same network
        </p> */}
        <div className="d-inline-block bg-white p-2 rounded my-2">
          <QRCode className="p-1" value={addressTitle} size={256} level="H" />
        </div>
        <div className="bg-soft-dark rounded py-1 my-3">
          <p className="my-0">{addressTitle}</p>
        </div>
        <div className="border-top pt-4 pb-1">
          <Button
            size="md"
            color="soft-light"
            style={{ borderRadius: '10px', border: '.5px solid grey' }}
            onClick={toggleQrModal}
          >
            <span className="mx-5 text-dark  fs-5">Close</span>
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QrModal;
