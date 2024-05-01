import React, { useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { formatIdTransaction } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import QrModal from '../Modals/QrModal';

const AddressWithDropdown = () => {
  const { address } = useParams();
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(null);

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };

  const handleCopy = async (e, text) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      copyToClipboard(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const renderAddressWithDropdown = () => {
    return (
      <div className="d-flex align-items-center ms-n3">
        <h4 className="text-address mb-0">
          {formatIdTransaction(address, 6, 8)}
        </h4>
        <UncontrolledDropdown className="card-header-dropdown">
          <DropdownToggle tag="a" className="text-reset" role="button">
            <i className="mdi mdi-chevron-down ms-2 fs-5"></i>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end ms-3">
            <DropdownItem
              className="d-flex align-items-center"
              onClick={toggleQrModal}
            >
              {' '}
              <i className="ri-qr-code-line fs-2 me-2"></i>
              <span className="fw-semibold">Show QR code</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex align-items-center"
              onClick={(e) => handleCopy(e, address)}
            >
              {isCopied ? (
                <i className="ri-check-line fs-2 me-2 "></i>
              ) : (
                <i className="ri-file-copy-line fs-2 me-2"></i>
              )}
              <span className="fw-semibold">Copy direction</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  };
  return (
    <div className="">
      {' '}
      <QrModal
        showQrModal={showQrModal}
        toggleQrModal={toggleQrModal}
        addressTitle={address}
      />
      <div
        className="mt-5
      
      "
      >
        {renderAddressWithDropdown()}
      </div>
    </div>
  );
};

export default AddressWithDropdown;
