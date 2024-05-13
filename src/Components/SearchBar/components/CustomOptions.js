import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { copyToClipboard, formatIdTransaction } from '../../../utils/utils';
import {
  setUserSavedAddresses,
  renameAddressInCookies,
  getUserSavedAddresses,
  removeAddressFromCookies,
} from '../../../helpers/cookies_helper';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import Swal from 'sweetalert2';

const CustomOptions = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(null);

  const [displayLabel, setDisplayLabel] = useState('');

  const [userAddresses, setUserAddresses] = useState(getUserSavedAddresses());

  useEffect(() => {
    const addresses = getUserSavedAddresses();
    setUserAddresses(addresses);
  }, []);

  useEffect(() => {
    if (props.data.label === props.data.value) {
      setDisplayLabel(props.data.value);
    } else {
      setDisplayLabel(props.data.label);
    }
  }, [props.data.label, props.data.value]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenModalRename = (e, option) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      inputValue: option.label,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        if (
          userAddresses.some(
            (addr) => addr.label === value && addr.value !== option.value,
          )
        ) {
          return 'This name already exists!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleRenameAddress(option.value, result.value);
      }
    });
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

  const handleDelete = (e, option) => {
    const optionDisplay =
      option.label === option.value
        ? option.value
        : `${option.label} (${option.value})`;

    e.preventDefault();
    e.stopPropagation();
    Swal.fire({
      title: `Are you sure you want to remove ${optionDisplay}?`,
      text: 'You cannot undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOptions = removeAddressFromCookies(option.value);
        setUserAddresses(updatedOptions);
        Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
      }
    });
  };

  const handleRenameAddress = async (valueToFind, newName) => {
    const newOptions = renameAddressInCookies(valueToFind, newName);
    setUserSavedAddresses(newOptions);
    setUserAddresses(newOptions);
    if (newName === valueToFind) {
      setDisplayLabel(valueToFind);
    } else {
      setDisplayLabel(newName);
    }
    Swal.fire('Updated!', 'Your address has been renamed.', 'success');
  };

  return (
    <>
      <components.Option {...props}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-start align-items-center">
            {props.data.logo && (
              <img
                className="img-fluid rounded-circle me-2"
                src={props.data.logo}
                alt={props.data.label}
                style={{ width: 30, height: 30 }}
              />
            )}
            <div className="d-flex flex-column">
              {displayLabel}
              {props.data.label !== props.data.value && (
                <span className="text-muted">
                  {formatIdTransaction(props.data.value, 6, 8)}
                </span>
              )}
            </div>
          </div>

          {userAddresses.some((addr) => addr.value === props.data.value) && (
            <Dropdown isOpen={isMenuOpen} toggle={toggleDropdown}>
              <DropdownToggle
                tag="span"
                className="dropdown-toggle"
              ></DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={(e) => handleCopy(e, props.data.value)}
                  className="d-flex align-items-center"
                >
                  {isCopied ? (
                    <i className="ri-check-line me-2 "></i>
                  ) : (
                    <i className="ri-file-copy-line me-2"></i>
                  )}
                  Copy Address
                </DropdownItem>

                <DropdownItem
                  onClick={(e) =>
                    handleOpenModalRename(e, {
                      label: displayLabel,
                      value: props.data.value,
                    })
                  }
                >
                  <i className="ri-edit-line me-2"></i> Rename
                </DropdownItem>

                <DropdownItem
                  onClick={(e) =>
                    handleDelete(e, {
                      label: displayLabel,
                      value: props.data.label,
                    })
                  }
                >
                  <i className="ri-delete-bin-line me-2"></i>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </components.Option>
    </>
  );
};

export default CustomOptions;
