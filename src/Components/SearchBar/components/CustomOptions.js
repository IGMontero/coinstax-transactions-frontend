import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import ReactDOM from 'react-dom';
import { copyToClipboard, formatIdTransaction } from '../../../utils/utils';
import {
  setUserSavedAddresses,
  renameAddressInCookies,
  removeAddressFromCookies,
} from '../../../helpers/cookies_helper';
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeAddressName,
  setAddressName,
} from '../../../slices/addressName/reducer';
import { useParams } from 'react-router-dom';

const CustomOptions = (props) => {
  const dispatch = useDispatch();
  const { address } = useParams();
  const addresses = useSelector((state) => state.addressName.addresses);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [displayLabel, setDisplayLabel] = useState('');
  // Window size states
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1221);
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth >= 768 && window.innerWidth <= 850,
  );
  const [isMoreSmallScreen, setIsMoreSmallScreen] = useState(
    window.innerWidth < 768,
  );
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(
    window.innerWidth < 485,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1221);
      setIsMediumScreen(window.innerWidth >= 768 && window.innerWidth <= 850);
      setIsMoreSmallScreen(window.innerWidth < 768);
      setIsVerySmallScreen(window.innerWidth < 485);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const { label, value } = props.data;
    let formattedLabel = label || value;

    if (isVerySmallScreen) {
      formattedLabel = label || formatIdTransaction(value, 8, 6);
    } else if (isMediumScreen) {
      formattedLabel = label || formatIdTransaction(value, 8, 12);
    } else if (isSmallScreen) {
      formattedLabel = label || formatIdTransaction(value, 8, 15);
    } else {
      formattedLabel = label || formatIdTransaction(value, 15, 25);
    }

    setDisplayLabel(formattedLabel);
  }, [
    props.data,
    isSmallScreen,
    isMediumScreen,
    isMoreSmallScreen,
    isVerySmallScreen,
  ]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenModalRename = (e, option) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Option:', option);

    const optionLabel = addresses.find(
      (addr) => addr.value === option.value,
    )?.label;

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      inputValue: optionLabel,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        // if (!value) {
        //   return 'You need to write something!';
        // }
        if (
          addresses.some(
            (addr) => addr.label === value && addr.value !== option.value,
          )
        ) {
          return 'This name already exists!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : null;
        handleRenameAddress(option.value, newName);
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
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: `Are you sure you want to remove ${option.label}?`,
      // text: 'You cannot undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove from cookies
        const updatedOptions = removeAddressFromCookies(option.value);
        setUserSavedAddresses(updatedOptions);
        dispatch(removeAddressName({ value: option.value }));

        Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
      }
    });
  };

  const handleRenameAddress = (valueToFind, newName) => {
    dispatch(setAddressName({ value: valueToFind, label: newName }));
    const updatedAddresses = renameAddressInCookies(valueToFind, newName);
    setUserSavedAddresses(updatedAddresses);
    setDisplayLabel(newName);
    // Swal.fire('Updated!', 'Your address has been renamed.', 'success');
  };

  const DropdownMenuPortal = ({ children }) => {
    return ReactDOM.createPortal(
      children,
      document.getElementById('portal-root'),
    );
  };

  const renderDropdownMenu = () => {
    return (
      <Dropdown isOpen={isMenuOpen} toggle={toggleDropdown}>
        <DropdownToggle
          style={{ zIndex: 10000 }}
          tag="span"
          className="dropdown-toggle"
        ></DropdownToggle>
        <DropdownMenuPortal>
          <DropdownMenu
            style={{
              zIndex: 10000,
            }}
          >
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
                  value: props.data.value,
                })
              }
            >
              <i className="ri-delete-bin-line me-2"></i>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </DropdownMenuPortal>
      </Dropdown>
    );
  };

  return (
    <>
      <components.Option {...props}>
        <div>
          <Row className="d-flex justify-content-between align-items-center">
            <Col className="col-10">
              <div className="d-flex justify-content-start align-items-center">
                {props.data.logo && (
                  <img
                    className="img-fluid rounded-circle me-2"
                    src={props.data.logo}
                    alt={props.data.label}
                    style={{ width: 30, height: 30 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const textNode = document.createElement('div');
                      textNode.textContent = props.data.label
                        ?.substring(0, 3)
                        .toUpperCase();
                      textNode.className =
                        'img-assets-placeholder avatar-xs me-2';
                      const container = e.target.parentNode;
                      container.insertBefore(textNode, container.firstChild);
                    }}
                  />
                )}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    {!props.data.label ? (
                      <span className="text-custom-menu-suggestions">
                        {displayLabel}
                      </span>
                    ) : (
                      <span className="text-custom-menu-suggestions">
                        {displayLabel}
                      </span>
                    )}
                    {address === props.data.value && (
                      <i className="ri-checkbox-blank-circle-fill fs-10 text-success ms-2"></i>
                    )}{' '}
                  </div>
                  {props.data.label && (
                    <span className="text-muted">
                      {formatIdTransaction(props.data.value, 6, 8)}
                    </span>
                  )}
                </div>
              </div>
            </Col>
            <Col className="col-2 d-flex justify-content-end align-items-center">
              {addresses.some((addr) => addr.value === props.data.value) && (
                <>{renderDropdownMenu()}</>
              )}
            </Col>
          </Row>
        </div>
      </components.Option>
    </>
  );
};

export default CustomOptions;
