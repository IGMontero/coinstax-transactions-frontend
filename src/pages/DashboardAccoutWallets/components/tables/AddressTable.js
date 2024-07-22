import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Collapse,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import {
  removeAddressName,
  setAddressName,
} from '../../../../slices/addressName/reducer';
import {
  removeAddressFromCookies,
  renameAddressInCookies,
  setUserSavedAddresses,
} from '../../../../helpers/cookies_helper';
import { copyToClipboard, formatIdTransaction } from '../../../../utils/utils';
import SearchBarWallets from '../SearchBarWallets';

const AddressTable = ({ addresses, user }) => {
  const [openCollapse, setOpenCollapse] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleCollapse = (collapseId) => {
    const newSet = new Set(openCollapse);
    if (newSet.has(collapseId)) {
      newSet.delete(collapseId);
    } else {
      newSet.add(collapseId);
    }
    setOpenCollapse(newSet);
  };

  const handleItemClick = (collapseId) => {
    toggleCollapse(collapseId);
  };

  const handleVisitAddress = (address) => {
    navigate(`/address/${address}`);
  };

  const toggleDropdown = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownOpen === index) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(index);
    }
  };

  const handleCopy = (e, text) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(text);
    Swal.fire({
      text: 'Address copied to clipboard!',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleOpenModalRename = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      inputValue: address.label,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (
          addresses.some(
            (addr) => addr.label === value && addr.value !== address.value,
          )
        ) {
          return 'This name already exists!';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : null;
        handleRenameAddress(address.value, newName);
      }
    });
  };

  const handleRenameAddress = (valueToFind, newName) => {
    dispatch(setAddressName({ value: valueToFind, label: newName }));
    const updatedAddresses = renameAddressInCookies(valueToFind, newName);
    setUserSavedAddresses(updatedAddresses);
    Swal.fire('Updated!', 'Your address has been renamed.', 'success');
  };

  const handleDelete = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: `Are you sure you want to remove ${address.label}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Close',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOptions = removeAddressFromCookies(address.value);
        setUserSavedAddresses(updatedOptions);
        dispatch(removeAddressName({ value: address.value }));
        Swal.fire('Deleted!', 'Your address has been deleted.', 'success');
      }
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const filteredAddresses = addresses.filter(
    (address) =>
      address.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.value?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container fluid>
      <Row className="mb-5">
        <Col md={4}>
          <SearchBarWallets onSearch={handleSearch} />
        </Col>
      </Row>
      <Row>
        {filteredAddresses.map((address, index) => {
          const collapseId = `address-${index}`;
          return (
            <Col lg={6} md={12} sm={12} xs={12} key={index} className="mb-3">
              <div
                onClick={() => handleItemClick(collapseId, address)}
                className={`address-card border rounded-4 p-2 bg-transparent cursor-pointer ${
                  openCollapse.has(collapseId)
                    ? 'border border-primary rounded px-2 mb-2'
                    : 'bg-light'
                }`}
              >
                <Row
                  className="align-items-center justify-content-between"
                  style={{
                    cursor: 'pointer',
                    padding: '.7rem',
                    paddingRight: '1rem',
                  }}
                >
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                  >
                    <div className="d-flex justify-content-between w-100">
                      <div className="d-flex flex-column">
                        <h5>{address.label}</h5>
                        <span className="text-muted">
                          {formatIdTransaction(address.value, 8, 12)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-end">
                        <Dropdown
                          isOpen={dropdownOpen === index}
                          toggle={(e) => toggleDropdown(e, index)}
                          direction="down"
                        >
                          <DropdownToggle
                            caret={false}
                            className="btn btn-light btn-sm text-muted"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleDropdown(e, index);
                            }}
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              className="d-flex aling-items-center"
                              onClick={(e) => handleCopy(e, address.value)}
                            >
                              <i className="ri-file-copy-line me-2"></i> Copy
                              Address
                            </DropdownItem>
                            <DropdownItem
                              className="d-flex aling-items-center"
                              onClick={(e) =>
                                handleOpenModalRename(e, {
                                  label: address.label,
                                  value: address.value,
                                })
                              }
                            >
                              <i className="ri-edit-line me-2"></i> Rename
                            </DropdownItem>
                            <DropdownItem
                              className="d-flex aling-items-center"
                              onClick={(e) =>
                                handleDelete(e, {
                                  label: address.label,
                                  value: address.value,
                                })
                              }
                            >
                              <i className="ri-delete-bin-line me-2"></i> Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </Col>
                </Row>
                {!user && (
                  <Collapse isOpen={openCollapse.has(collapseId)}>
                    <CardBody
                      className={`cursor-pointer px-3 ${
                        openCollapse.has(collapseId) ? 'border-info' : ''
                      }`}
                    >
                      <div className="d-flex flex-column">
                        <span
                          className="text-hover-underline  text-dark col-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisitAddress(address.value);
                          }}
                        >
                          Visit Address
                        </span>
                      </div>
                    </CardBody>
                  </Collapse>
                )}
              </div>
            </Col>
          );
        })}
        {filteredAddresses.length === 0 && (
          <Col>
            <h4>No addresses Yet</h4>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default AddressTable;
