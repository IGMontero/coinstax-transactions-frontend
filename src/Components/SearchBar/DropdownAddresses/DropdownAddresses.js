import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge,
} from 'reactstrap';

import Swal from 'sweetalert2';
import {
  copyToClipboard,
  formatIdTransaction,
  removeOptionsFromLocalStorage,
} from '../../../utils/utils';
import QrModal from '../../Modals/QrModal';
import RenameAddressModal from '../../Modals/RenameAddress';

const DropdownAddresses = ({ onSelect, optionDropdown, isUnsupported }) => {
  const { address } = useParams();
  const location = useLocation();

  // #region STATES
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [options, setOptions] = useState(
    JSON.parse(localStorage.getItem('searchOptions')) || [],
  );
  const [dropdownControlledByThisItem, setDropdownControlledByThisItem] =
    useState({});
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState('');
  const [selectedOptionLabel, setSelectedOptionLabel] = useState('');

  const [renameModal, setRenameModal] = useState(false);

  // #region USE EFFECTS
  useEffect(() => {
    if (!dropdownOpen) {
      setDropdownControlledByThisItem({});
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (isUnsupported) {
      removeOptionsFromLocalStorage(setOptions, address);
    }
  }, [isUnsupported]);

  useEffect(() => {
    if (optionDropdown && optionDropdown.value && optionDropdown.label) {
      options.push(optionDropdown);

      const filteredOptions = options.filter(
        (option, index, self) =>
          index === self.findIndex((t) => t.value === option.value),
      );
      // order options by alphabetical order
      filteredOptions.sort((a, b) => a.label.localeCompare(b.label));

      setOptions(filteredOptions);
    }
  }, [optionDropdown]);

  // #region HANDLERS
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubDropdown = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    setDropdownControlledByThisItem((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleOpenModalRename = (e, option) => {
    e.stopPropagation();
    setSelectedOptionValue(option.value);
    setSelectedOptionLabel(option.label);
    setRenameModal(true);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setDropdownOpen(false);
  };

  const handleDeleteOptionFromLocalStorage = (e, option) => {
    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeOptionsFromLocalStorage(setOptions, option.value);

        Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
      }
    });
  };

  const handleShowQrCode = (e, optionValue) => {
    e.stopPropagation();
    setSelectedOptionValue(optionValue);
    setQrCodeModal(true);
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
      JSON.parse(localStorage.getItem('searchOptions')) || [];
    const newOptions = storedOptions.map((storedOption) => {
      if (storedOption.value === valueToFind) {
        return { ...storedOption, label: newName };
      }
      return storedOption;
    });
    localStorage.setItem('searchOptions', JSON.stringify(newOptions));
    setOptions(newOptions);
  };

  // #region RENDER FUNCTIONS
  const renderSubDropdown = (option, index) => {
    return (
      <Dropdown
        isOpen={dropdownControlledByThisItem[index]}
        toggle={(e) => handleSubDropdown(e, index)}
        direction="bottom-end"
        className="ms-auto
       
        "
      >
        <DropdownToggle
          tag="span"
          data-toggle="dropdown"
          caret
          aria-expanded={dropdownControlledByThisItem[index]}
        ></DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={(e) => handleCopy(e, option.value)}
            className="d-flex align-items-center"
          >
            {isCopied ? (
              <i className="ri-check-line  me-2 "></i>
            ) : (
              <i className="ri-file-copy-line  me-2"></i>
            )}
            Copy Address
          </DropdownItem>
          <DropdownItem
            onClick={(e) => handleShowQrCode(e, option.value)}
            className="d-flex align-items-center"
          >
            <i className="ri-qr-code-line me-2"></i> Show QR code
          </DropdownItem>

          <DropdownItem
            onClick={(e) => handleOpenModalRename(e, option)}
            className="d-flex align-items-center"
          >
            <i className="ri-edit-line me-2"></i>
            Rename Wallet
          </DropdownItem>
          <DropdownItem divider />

          <DropdownItem
            className="d-flex align-items-center "
            onClick={(e) => handleDeleteOptionFromLocalStorage(e, option)}
          >
            <i className="ri-delete-bin-line text-danger me-2"></i>
            <span className="text-danger">Remove</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  // #region RENDER
  return (
    <>
      <QrModal
        showQrModal={qrCodeModal}
        toggleQrModal={() => setQrCodeModal(!qrCodeModal)}
        addressTitle={selectedOptionValue}
      />
      <RenameAddressModal
        open={renameModal}
        setOpen={setRenameModal}
        address={selectedOptionLabel}
        options={options}
        onSave={(newName) => {
          handleRenameNameFromLocalStorage(selectedOptionValue, newName);
        }}
      />

      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle
          caret={false}
          color="primary"
          className="btn
          btn-primary dropdown-toggle btn-sm align-items-center d-flex justify-content-center ms-3 p-1 mb-0"
        >
          <i className="bi bi-list fw-bold fs-8 px-0 pe-n1"></i>
        </DropdownToggle>
        <DropdownMenu
          className="mt-1
        overflow-auto
        "
          style={{
            maxHeight: '500px',
            width: '300px',
          }}
        >
          {options.length > 0 ? (
            options.map((option, index) =>
              option ? (
                <>
                  <DropdownItem
                    className={`d-flex justify-content-between align-items-center pe-2 ${
                      option.value === address ? 'active' : ''
                    }`}
                    key={index}
                    onClick={() => handleSelect(option)}
                  >
                    {option.logo ? (
                      <img
                        src={option.logo}
                        alt="logo"
                        className="me-2"
                        style={{ width: '20px' }}
                      />
                    ) : null}
                    <div className="d-flex flex-column me-3">
                      {option.label === option.value ? (
                        <span className="">
                          {formatIdTransaction(option.value, 6, 8)}{' '}
                          {option.value === address ? (
                            <div className="online-icon"></div>
                          ) : null}
                        </span>
                      ) : (
                        <>
                          <span className="d-flex align-items-center">
                            {formatIdTransaction(option.label, 6, 8)}
                            {option.value === address ? (
                              <div className="online-icon"></div>
                            ) : null}
                          </span>
                          <span className=" text-muted">
                            {formatIdTransaction(option.value, 6, 8)}
                          </span>
                        </>
                      )}
                    </div>
                    {renderSubDropdown(option, index)}
                  </DropdownItem>
                  {options.length - 1 !== index ? (
                    <DropdownItem divider />
                  ) : null}
                </>
              ) : null,
            )
          ) : (
            <DropdownItem disabled>No results</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default DropdownAddresses;
