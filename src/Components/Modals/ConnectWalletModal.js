import React from 'react';
import { Button, Spinner } from 'reactstrap';

function ConnectWalletModal({ isOpen, details, onClose }) {
  if (!isOpen) return null;

  console.log('Details: ', details);

  const loadingMessage = details?.name
    ? `Connecting to ${details.name}`
    : 'Connecting to wallet';

  const modalTitle = `Connect to ${details.name || 'Wallet'}`;

  const isLoading = details?.loading;

  // return (
  //   <div
  //     className=" position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
  //     style={{
  //       // backgroundColor: 'rgba(0, 0, 0, 0.8)',
  //       zIndex: 1,
  //       overflow: 'hidden',
  //     }}
  //   >
  //     <div
  //       className="d-flex flex-column justify-content-center align-items-center"
  //       style={{
  //         backgroundColor: 'rgba(51, 51, 51, 1)',

  //         padding: '10px 20px',
  //         borderRadius: '0.5rem',
  //         position: 'relative',
  //         width: '300px',
  //         height: '300px',
  //         textAlign: 'center',
  //       }}
  //     >
  //       <h3 className="text">{modalTitle}</h3>

  //       {!isLoading && (
  //         <Button
  //           close
  //           onClick={onClose}
  //           style={{
  //             position: 'absolute',
  //             top: '10px',
  //             right: '10px',
  //             fontSize: '1rem',
  //             color: '#fff',
  //           }}
  //         />
  //       )}

  //       {isLoading && (
  //         <>
  //           <Spinner
  //             animation="border"
  //             color="primary"
  //             style={{ width: '3rem', height: '3rem' }}
  //             className="mb-3"
  //           />

  //           <h5 className="text-dark">{loadingMessage}</h5>

  //           {/* // Please wait */}

  //           <p className="" style={{ fontSize: '0.8rem' }}>
  //             Please wait...
  //           </p>
  //         </>
  //       )}

  //       {details?.message && (
  //         <p className="" style={{}}>
  //           {details.message}
  //         </p>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <div
        className="d-flex flex-column justify-content-start align-items-center"
        style={{
          backgroundColor: 'rgba(51, 51, 51, 1)',
          padding: '20px',
          borderRadius: '0.5rem',
          position: 'relative',
          width: '450px',
          maxWidth: '90vw', // Adjust the max-width if needed
          maxHeight: '90vh', // Adjust the max-height if needed
          textAlign: 'center',
        }}
      >
        {/* Modal Header */}
        <div
          className="w-100 d-flex justify-content-between align-items-center"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '10px',
            marginBottom: '10px',
          }}
        >
          <h3 className="text mb-0" style={{ flex: 1 }}>
            {modalTitle}
          </h3>

          {!isLoading && (
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
          )}
        </div>

        {/* Modal Content */}
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ flex: 1 }}
        >
          {isLoading ? (
            <>
              <Spinner
                animation="border"
                color="primary"
                style={{ width: '1rem', height: '1rem' }}
                className="mb-3"
              />
              <h5 className="text">{loadingMessage}</h5>
              <p style={{ fontSize: '0.8rem' }}>Please wait...</p>
            </>
          ) : (
            <>{details?.message && <p>{details.message}</p>}</>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletModal;
