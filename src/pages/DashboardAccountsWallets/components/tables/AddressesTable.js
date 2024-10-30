import React, { useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import {
  copyToClipboard,
  CurrencyUSD,
  formatAddressToShortVersion,
  parseValuesToLocale,
} from '../../../../utils/utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';
import { layoutModeTypes } from '../../../../Components/constants/layout';
import {
  deleteUserAddressWallet,
  reorderUserWallets,
  updateUserWalletAddress,
} from '../../../../slices/userWallets/thunk';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setUserPortfolioSummary } from '../../../../slices/userWallets/reducer';
import {
  removeAddressName,
  setAddressName,
} from '../../../../slices/addressName/reducer';
import {
  removeAddressFromCookies,
  setUserSavedAddresses,
} from '../../../../helpers/cookies_helper';

const AddressesTable = ({ userId, initialAddresses, loading, onRefresh }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(initialAddresses);

  const addressesCookies = useSelector((state) => state.addressName.addresses);

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

  const handleItemClick = (address) => {
    //toggleCollapse(collapseId);
    navigate(`/address/${address}`);
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

  // const handleSetAddresses = (updatedAddresses) => {
  //   dispatch(setUserPortfolioSummary(updatedAddresses));
  // };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Update Wallet Address',
      input: 'text',
      inputValue: address.name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (
          addresses?.some(
            (addr) => addr.name === value && addr.address !== address.address,
          )
        ) {
          return 'This name already exists!';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim() ? result.value : null;

        try {
          const response = await dispatch(
            updateUserWalletAddress({
              userId,
              name: newName,
              addressId: address.id,
            }),
          ).unwrap();

          if (response && !response.error) {
            dispatch(
              setAddressName({ value: address.address, label: newName }),
            );
            setAddresses(
              addresses.map((addr) => {
                if (addr.id === address.id) {
                  return {
                    ...addr,
                    name: newName,
                  };
                }
                return addr;
              }),
            );

            onRefresh(userId);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to update address',
              icon: 'error',
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Failed to update address',
            icon: 'error',
          });

          console.log(error);
        }
      }
    });
  };

  const handleDeleteUserAddress = (address) => {
    console.log('address:', address);
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure to delete wallet ${address.name ? address.name : address.address}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({ userId, addressId: address.id }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });
            setAddresses(addresses.filter((addr) => addr.id !== address.id));

            // const addressToDeleteFromCookies = addressesCookies.find(
            //   (addr) => addr.value === address.address,
            // );
            // if (addressToDeleteFromCookies) {
            // dispatch(removeAddressName(addressToDeleteFromCookies));
            // setUserSavedAddresses(
            //   removeAddressFromCookies(addressToDeleteFromCookies.value),
            // );
            // dispatch(removeAddressName({ value: address.id }));
            // }

            onRefresh(userId);
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete address',
              icon: 'error',
            });
          }
        } catch (error) {
          console.error('Failed to delete address:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete address',
            icon: 'error',
          });
        }
      }
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(addresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updateItems = items.map((item, idx) => ({
      ...item,
      index: idx + 1,
    }));

    setAddresses(items);

    handleReorderAddresses(updateItems);
  };

  const handleReorderAddresses = async (updatedAddresses) => {
    const payload = updatedAddresses.map((address) => ({
      Id: address.id,
      Index: address.index,
    }));

    try {
      const response = await dispatch(
        reorderUserWallets({ userId: userId, addresses: payload }),
      ).unwrap();

      if (response && !response.error) {
        onRefresh(userId);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to reorder addresses',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to reorder addresses:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to reorder addresses',
        icon: 'error',
      });
    }
  };

  const getValueForAddress = (addressData) => {
    const isCompleted = addressData.complete;
    if (!isCompleted) {
      return (
        <Skeleton
          width={60}
          baseColor={isDarkMode ? '#333' : '#f3f3f3'}
          highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
        />
      );
    }
    if (!addressData) {
      return '$0';
    }

    return parseValuesToLocale(addressData.value, CurrencyUSD);
  };

  const getDisplayText = (address) => {
    const addressCustomName = addressesCookies.find(
      (addr) => addr.value?.toLowerCase() === address?.toLowerCase(),
    )?.label;
    if (addressCustomName) {
      return addressCustomName;
    } else {
      return null;
    }
  };

  return (
    <>
      {/* <ConnectWalletModal
        isOpen={modalConnectWallet}
        setIsOpen={setModalConnectWallet}
        userId={userId}
        onRefresh={onRefresh}
      /> */}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="addresses">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Row>
                {addresses?.map((address, index) => {
                  const collapseId = `address-${index}`;

                  const addressName = address.name || address.Name;
                  const itemAddress = address.address || address.Address;

                  const isCompleted = address.complete;
                  const isLoading = !isCompleted;

                  const addressId = String(address.id || address.Id);
                  return (
                    <Draggable
                      key={addressId}
                      draggableId={addressId}
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
                              onClick={() => handleItemClick(itemAddress)}
                              className={`address-card p-2 bg-transparent cursor-grab ${
                                openCollapse.has(collapseId)
                                  ? 'px-2 mb-2'
                                  : 'bg-light'
                              }`}
                            >
                              <Row
                                className="align-items-center justify-content-between"
                                style={{
                                  cursor: 'pointer'
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
                                      <h5>{getDisplayText(itemAddress)}</h5>
                                      <span className="text-muted">
                                        {formatAddressToShortVersion(
                                          itemAddress,
                                        )}
                                      </span>
                                      <span className="text-muted">
                                        {isLoading ? (
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
                                          getValueForAddress(address)
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
                                            onClick={() => {
                                              handleVisitAddress(itemAddress);
                                            }}
                                          >
                                            <i className="ri-eye-fill me-2"></i>{' '}
                                            View
                                          </DropdownItem>

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

                              {/*}
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
                              */}
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
