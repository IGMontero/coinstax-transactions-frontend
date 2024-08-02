import React, { useEffect, useState } from 'react';
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
  updateUserWalletAddress,
  deleteUserAddressWallet,
  getUserWallets,
} from '../../../../slices/userWallets/thunk';
import {
  copyToClipboard,
  CurrencyUSD,
  formatIdTransaction,
  parseValuesToLocale,
} from '../../../../utils/utils';
import { reorderUserWallets } from '../../../../slices/userWallets/thunk';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ConnectWalletModal from '../../../../Components/Modals/ConnectWalletModal';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import { layoutModeTypes } from '../../../../Components/constants/layout';

const AddressesTable = ({
  modalConnectWallet,
  setModalConnectWallet,
  userId,
  items,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userPortfolioSummary } = useSelector((state) => state.userWallets);
  const { layoutModeType } = useSelector((state) => ({
    layoutModeType: state.Layout.layoutModeType,
  }));
  const isDarkMode = layoutModeType === layoutModeTypes['DARKMODE'];
  const [addresses, setAddresses] = useState([]);
  const [openCollapse, setOpenCollapse] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const [loading, setLoading] = useState(false);

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
    // Swal.fire({
    //   text: 'Address copied to clipboard!',
    //   icon: 'success',
    //   timer: 2000,
    //   showConfirmButton: false,
    // });
  };

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: 'Update Wallet Address',
      input: 'text',
      inputValue: address.Name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      inputValidator: (value) => {
        if (
          addresses.some(
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
              addressId: address.Id,
            }),
          ).unwrap();

          if (response && !response.error) {
            // Swal.fire({
            //   title: 'Success',
            //   text: 'Wallet address updated successfully',
            //   icon: 'success',
            // });

            fetchUserWallets();
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
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure to delete wallet ${address.Name ? address.Name : address.Address}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            deleteUserAddressWallet({ userId, addressId: address.Id }),
          ).unwrap();

          if (response && !response.error) {
            Swal.fire({
              title: 'Success',
              text: 'Wallet address deleted successfully',
              icon: 'success',
            });
            fetchUserWallets();
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(addresses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      Index: idx + 1,
    }));

    setAddresses(updatedItems);

    await handleReorderAddresses(updatedItems);
  };

  const handleReorderAddresses = async (updatedAddresses) => {
    const payload = updatedAddresses.map((address) => ({
      Id: address.Id,
      Index: address.Index,
    }));

    try {
      const response = await dispatch(
        reorderUserWallets({ userId: userId, addresses: payload }),
      ).unwrap();

      if (response && !response.error) {
        fetchUserWallets();
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

  const fetchUserWallets = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getUserWallets(userId)).unwrap();

      if (response && !response.error) {
        setAddresses(response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserWallets();
    }
  }, [userId]);

  const getValueForAddress = (address) => {
    if (loading) {
      <Skeleton
        width={60}
        baseColor={isDarkMode ? '#333' : '#f3f3f3'}
        highlightColor={isDarkMode ? '#444' : '#e0e0e0'}
      />;
    }
    if (!userPortfolioSummary || !userPortfolioSummary.addresses) {
      return '$ 0';
    }

    const addressEntry = userPortfolioSummary.addresses.find(
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
        onRefresh={fetchUserWallets}
        userId={userId}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="addresses">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Row>
                {addresses?.map((address, index) => {
                  const collapseId = `address-${index}`;
                  return (
                    <Draggable
                      key={address?.Id}
                      draggableId={address?.Id?.toString() || 1}
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
                                      {address.Name && <h5>{address.Name}</h5>}
                                      <span className="text-muted">
                                        {formatIdTransaction(
                                          address.Address,
                                          8,
                                          12,
                                        )}
                                      </span>
                                      <span className="text-muted">
                                        {getValueForAddress(address.Address)}
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
                                              handleCopy(e, address.Address)
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
                                        handleVisitAddress(address.Address);
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
