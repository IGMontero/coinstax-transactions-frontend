import React, { useEffect, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { formatIdTransaction } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import QrModal from '../Modals/QrModal';
import RenameAddressModal from '../Modals/RenameAddress';

const AddressWithDropdown = () => {
  const { address } = useParams();

  const [showQrModal, setShowQrModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [formattedAddressLabel, setFormattedAddressLabel] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedOptionLabel, setSelectedOptionLabel] = useState('');
  const [selectedOptionValue, setSelectedOptionValue] = useState('');

  const userAddresses = JSON.parse(localStorage.getItem('userAddresses'));

  useEffect(() => {
    const userAddresses = JSON.parse(localStorage.getItem('userAddresses'));
    const matchingAddress = userAddresses.find(
      (addr) => addr.value === address,
    );
    const currentFormattedValue = formatIdTransaction(address, 6, 8);
    setFormattedValue(currentFormattedValue);
    if (matchingAddress) {
      setFormattedAddressLabel(matchingAddress.label);
      setSelectedOptionLabel(matchingAddress.label);
      setSelectedOptionValue(matchingAddress.value);
    }
  }, [address]);

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

  const handleRenameNameFromLocalStorage = (valueToFind, newName) => {
    const storedOptions =
      JSON.parse(localStorage.getItem('userAddresses')) || [];
    const newOptions = storedOptions.map((storedOption) => {
      if (storedOption.value === valueToFind) {
        return { ...storedOption, label: newName };
      }
      return storedOption;
    });
    localStorage.setItem('userAddresses', JSON.stringify(newOptions));
    setFormattedAddressLabel(newName);
  };

  const handleOpenModalRename = (e, option) => {
    e.stopPropagation();
    setSelectedOptionLabel(option.label);
    setSelectedOptionValue(option.value);
    setRenameModal(true);
  };

  useEffect(() => {
    const matchingAddress = userAddresses.find(
      (addr) => addr.value === address,
    );
    const currentFormattedValue = formatIdTransaction(address, 6, 8);
    setFormattedValue(currentFormattedValue);
    if (matchingAddress) {
      if (matchingAddress.label === matchingAddress.value) {
        setFormattedAddressLabel(currentFormattedValue);
      } else {
        setFormattedAddressLabel(matchingAddress.label);
      }
    }
  }, [address]);

  const renderAddressWithDropdown = () => {
    return (
      <div className="d-flex align-items-center ms-n3">
        <h4 className="text-address mb-0">
          {formattedAddressLabel || formatIdTransaction(address, 6, 8)}
        </h4>
        {formattedAddressLabel && formattedAddressLabel !== formattedValue && (
          <span className="badge bg-soft-dark text-dark fw-semibold fs-6 mb-0 ms-2">
            {formattedValue}
          </span>
        )}
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
              <span className="fw-semibold">Copy Address</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex align-items-center"
              onClick={(e) =>
                handleOpenModalRename(e, {
                  label: formattedAddressLabel,
                  value: address,
                })
              }
            >
              <i className="ri-pencil-line fs-2 me-2"></i>
              <span className="fw-semibold">Rename</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  };

  return (
    <div className="">
      {' '}
      <RenameAddressModal
        open={renameModal}
        setOpen={setRenameModal}
        address={selectedOptionLabel}
        options={userAddresses}
        onSave={(newName) =>
          handleRenameNameFromLocalStorage(selectedOptionValue, newName)
        }
      />
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
