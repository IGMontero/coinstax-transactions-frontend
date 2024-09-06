import React from 'react';
import { Modal, ModalBody, Button, Spinner } from 'reactstrap';

function ModalLoader({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className=" position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        // backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundColor: 'rgba(51, 51, 51, 0.8)',

          padding: '40px',
          borderRadius: '0.5rem',
          position: 'relative',
          width: '300px',
          height: '300px',
        }}
      >
        <Button
          close
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '1rem',
            color: '#fff',
          }}
        />
        <Spinner
          animation="border"
          color="primary"
          style={{ width: '3rem', height: '3rem' }}
          className="mb-3"
        />
        <h5 className="text-dark">Please wait </h5>
      </div>
    </div>
  );
}

export default ModalLoader;
