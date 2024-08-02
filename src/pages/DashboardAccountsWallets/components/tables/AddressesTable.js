import React, { useState } from 'react';
import {
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
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUserWalletAddress,
  deleteUserAddressWallet,
  reorderUserWallets,
} from '../../../../slices/userWallets/thunk';
import {
  copyToClipboard,
  CurrencyUSD,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../../../utils/utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ConnectWalletModal from '../../../../Components/Modals/ConnectWalletModal';
import Skeleton from 'react-loading-skeleton';
import { layoutModeTypes } from '../../../../Components/constants/layout';

const AddressesTable = ({
  modalConnectWallet,
  setModalConnectWallet,
  userId,
  addresses,
  setAddresses,
  loading,
  onUpdateAddress,
  onReorderAddress,
  onDeleteAddress,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log('addresses ', addresses);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const [openCollapse, setOpenCollapse] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(null);

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
  };

  const handleUpdateAddress = (e, address) => {
    onUpdateAddress(e, address);
  };

  const handleDeleteUserAddress = (address) => {
    onDeleteAddress(address);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(addresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    setAddresses(updatedItems);

    await onReorderAddress(updatedItems);
  };

  const getValueForAddress = (address) => {
    if (loading) {
      return (
        <Skeleton
          width={60}
          baseColor={isDarkMode ? '#333' : '#f3f3f3'}
          highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
        />
      );
    }
    if (!address) {
      return '$ 0';
    }

    const addressEntry = addresses.find(
      (entry) => entry.address?.toLowerCase() === address?.toLowerCase(),
    );
    if (!addressEntry) {
      return '';
    }
    return parseValuesToLocale(addressEntry.value, CurrencyUSD);
  };

  return (
    <>
      <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={userId}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="addresses">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Row>
                {addresses?.map((address, index) => {
                  const collapseId = `address-${index}`;

                  const addressName = address.name || address.Name;
                  const itemAddress = address.address || address.Address;
                  return (
                    <Draggable
                      key={address?.id}
                      draggableId={address?.id?.toString() || 1}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="mb-3 "
                          >
                            <div
                              onClick={() => handleItemClick(collapseId)}
                              className={`address-card border rounded-4 p-2 bg-transparent cursor-grab ${
                                openCollapse.has(collapseId)
                                  ? 'border border-primary rounded px-2 mb-2'
                                  : 'bg-light'
                              }`}
                            >
                              <Row
                                className="align-items-center justify-content-between"
                                style={{
                                  cursor: 'grab',
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
                                  <div className="d-flex justify-content-between align-items-center w-100">
                                    <div className="d-flex flex-column">
                                      {addressName && <h5>{addressName}</h5>}
                                      <span className="text-muted">
                                        {loading ? (
                                          <Skeleton
                                            width={60}
                                            baseColor={
                                              isDarkMode ? '#333' : '#f3f3f3'
                                            }
                                            highlightColor={
                                              isDarkMode ? '#444' : '#e0e0e0'
                                            }
                                          />
                                        ) : (
                                          formatIdTransaction(
                                            itemAddress,
                                            8,
                                            12,
                                          )
                                        )}
                                      </span>
                                      <span className="text-muted">
                                        {loading ? (
                                          <Skeleton
                                            width={60}
                                            baseColor={
                                              isDarkMode ? '#333' : '#f3f3f3'
                                            }
                                            highlightColor={
                                              isDarkMode ? '#444' : '#e0e0e0'
                                            }
                                          />
                                        ) : (
                                          getValueForAddress(itemAddress)
                                        )}
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
                                            onClick={(e) =>
                                              handleCopy(e, itemAddress)
                                            }
                                          >
                                            <i className="ri-file-copy-line me-2"></i>{' '}
                                            Copy Address
                                          </DropdownItem>
                                          <DropdownItem
                                            className="d-flex aling-items-center"
                                            onClick={(e) => {
                                              handleUpdateAddress(e, address);
                                            }}
                                          >
                                            <i className="ri-edit-line me-2"></i>{' '}
                                            Rename
                                          </DropdownItem>
                                          <DropdownItem
                                            className="d-flex aling-items-center"
                                            onClick={() => {
                                              handleDeleteUserAddress(address);
                                            }}
                                          >
                                            <i className="ri-delete-bin-line me-2"></i>{' '}
                                            Delete
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </Col>
                              </Row>

                              <Collapse isOpen={openCollapse.has(collapseId)}>
                                <CardBody
                                  className={`cursor-pointer px-3 ${
                                    openCollapse.has(collapseId)
                                      ? 'border-info'
                                      : ''
                                  }`}
                                >
                                  <div className="d-flex flex-column">
                                    <span
                                      className="text-hover-underline  text-dark col-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVisitAddress(itemAddress);
                                      }}
                                    >
                                      Visit Address
                                    </span>
                                  </div>
                                </CardBody>
                              </Collapse>
                            </div>
                          </Col>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Row>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {addresses?.length === 0 && !loading && (
        <Col className="py-5">
          <h4>Connect a wallet to get started</h4>
        </Col>
      )}
    </>
  );
};

export default AddressesTable;
