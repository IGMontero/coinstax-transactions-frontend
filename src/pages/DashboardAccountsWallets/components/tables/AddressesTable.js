import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import Swal from 'sweetalert2';
import { layoutModeTypes } from '../../../../Components/constants/layout';
import { setAddressName } from '../../../../slices/addressName/reducer';
import {
  deleteUserAddressWallet,
  reorderUserWallets,
  updateUserWalletAddress,
} from '../../../../slices/userWallets/thunk';
import {
  copyToClipboard,
  CurrencyUSD,
  parseValuesToLocale,
} from '../../../../utils/utils';

const AddressesTable = ({ userId, initialAddresses, loading, onRefresh }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(initialAddresses);

  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const [openCollapse, setOpenCollapse] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleItemClick = (address) => {
    //toggleCollapse(collapseId);
    navigate(`/address/${address}`);
  };

  console.log('addresses table:', addresses);

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

  // const handleSetAddresses = (updatedAddresses) => {
  //   dispatch(setUserPortfolioSummary(updatedAddresses));
  // };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Rename wallet',
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

  const handleDeleteUserAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();
    const addressDisplay = address.name ? address.name : address.address;
    Swal.fire({
      // title: `Delete wallet ${addressDisplay}`,
      text: `Delete wallet ${addressDisplay}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({ userId, addressId: address.id }),
          ).unwrap();

          if (response && !response.error) {
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
    console.log('address:', address);
    const addressCustomName = address?.Name;
    if (addressCustomName) {
      return addressCustomName;
    } else {
      return address;
    }
  };
  const [showOptions, setShowOptions] = useState(null);

  // const renderOptions = (address, index, itemAddress) => {
  //   return (
  //     <Dropdown
  //       isOpen={dropdownOpen === index}
  //       toggle={(e) => toggleDropdown(e, index)}
  //       direction="down"
  //     >
  //       <DropdownToggle
  //         caret={false}
  //         className="btn btn-light btn-sm text-muted"
  //         onClick={(e) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           toggleDropdown(e, index);
  //         }}
  //       >
  //         <i className="ri-more-2-fill"></i>
  //       </DropdownToggle>
  //       <DropdownMenu>
  //         <DropdownItem
  //           className="d-flex aling-items-center"
  //           onClick={() => {
  //             handleVisitAddress(itemAddress);
  //           }}
  //         >
  //           <i className="ri-eye-fill me-2"></i> View
  //         </DropdownItem>

  //         <DropdownItem
  //           className="d-flex aling-items-center"
  //           onClick={(e) => handleCopy(e, itemAddress)}
  //         >
  //           <i className="ri-file-copy-line me-2"></i> Copy Address
  //         </DropdownItem>
  //         <DropdownItem
  //           className="d-flex aling-items-center"
  //           onClick={(e) => {
  //             handleUpdateAddress(e, address);
  //           }}
  //         >
  //           <i className="ri-edit-line me-2"></i> Rename
  //         </DropdownItem>
  //         <DropdownItem
  //           className="d-flex aling-items-center"
  //           onClick={() => {
  //             handleDeleteUserAddress(address);
  //           }}
  //         >
  //           <i className="ri-delete-bin-line me-2"></i> Delete
  //         </DropdownItem>
  //       </DropdownMenu>
  //     </Dropdown>
  //   );
  // };
  const [isCopied, setIsCopied] = useState(null);

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

  const renderOptions = (address, index, itemAddress) => {
    return (
      <div
        style={{
          // animation: 'fadeIn 0.5s',
          animationFillMode: 'forwards',
        }}
        className="d-flex align-items-center"
      >
        <div>
          <button
            title={'Copy Address'}
            className="btn btn-transparent btn-hover-light  btn-sm text-dark me-1"
            onClick={(e) => handleCopy(e, itemAddress)}
          >
            {isCopied ? (
              <i className="ri-check-line fs-6"></i>
            ) : (
              <i className="ri-file-copy-line fs-6"></i>
            )}
          </button>
        </div>
        <button
          title={'Edit Address'}
          className="btn btn-transparent btn-hover-light  btn-sm text-dark me-1"
          onClick={(e) => handleUpdateAddress(e, address)}
        >
          <i className="ri-edit-line fs-6"></i>
        </button>
        <button
          title={'Delete Address'}
          className="btn btn-transparent btn-hover-light btn-sm text-dark"
          onClick={(e) => handleDeleteUserAddress(e, address)}
        >
          <i className="ri-close-line fs-6"></i>
        </button>
      </div>
    );
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
                  console.log(addressName);

                  return (
                    <Draggable
                      key={addressId}
                      draggableId={addressId}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          onMouseEnter={() => setShowOptions(index)}
                          onMouseLeave={() => setShowOptions(null)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className={`mb-3 `}
                          >
                            <div
                              onClick={() => handleItemClick(itemAddress)}
                              className={`address-card p-2 rounded bg-transparent cursor-grab ${
                                openCollapse.has(collapseId)
                                  ? 'px-2 mb-2'
                                  : 'bg-light'
                              }`}
                            >
                              <Row
                                className="align-items-center justify-content-between"
                                style={{
                                  cursor: 'pointer',
                                }}
                              >
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  xs={12}
                                  className="d-flex align-items-center me-lg-0 me-1 mb-lg-0 mb-3"
                                >
                                  <div
                                    style={{
                                      maxWidth: '100%',
                                      whiteSpace: 'nowrap',
                                      // overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      flexWrap: 'wrap',
                                    }}
                                    className="d-flex justify-content-between align-items-center w-100"
                                  >
                                    <div
                                      style={{
                                        maxWidth: '100%',
                                      }}
                                      className="d-flex flex-column"
                                    >
                                      {addressName && (
                                        <h5
                                          style={{
                                            maxWidth: '100%',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            flexWrap: 'wrap',
                                          }}
                                        >
                                          {addressName}
                                        </h5>
                                      )}

                                      <span
                                        className="text-muted"
                                        style={{
                                          // maxWidth: '100%',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          flexWrap: 'wrap',
                                        }}
                                      >
                                        {itemAddress}
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
                                      {showOptions === index &&
                                        renderOptions(
                                          address,
                                          index,
                                          itemAddress,
                                        )}
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
