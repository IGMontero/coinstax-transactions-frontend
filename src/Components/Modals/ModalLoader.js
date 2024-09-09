import React from 'react';
import { Button, Spinner } from 'reactstrap';

function ModalLoader({ isOpen, details, onClose }) {
  if (!isOpen) return null;

  console.log('Details: ', details);

  const loadingMessage = details?.name
    ? `Connecting to ${details.name}`
    : 'Connecting to wallet';

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

          padding: '10px 20px',
          borderRadius: '0.5rem',
          position: 'relative',
          width: '300px',
          height: '300px',
          textAlign: 'center',
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
        <h5 className="text-dark">{loadingMessage}</h5>

        {/* // Please wait */}

        <p className="" style={{ fontSize: '0.8rem' }}>
          Please wait...
        </p>

        {details?.message && (
          <p className="text-light" style={{ fontSize: '0.8rem' }}>
            {details.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ModalLoader;
