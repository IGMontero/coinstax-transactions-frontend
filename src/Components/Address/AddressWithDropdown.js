import React, { useEffect, useState } from 'react';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import QrModal from '../Modals/QrModal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { setAddressName } from '../../slices/addressName/reducer';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import NetworkDropdown from '../NetworkDropdown/NetworkDropdown';
import { updateUserWalletAddress } from '../../slices/userWallets/thunk';

const AddressWithDropdown = ({
  filteredNetworks,
  isOnlyAllNetwork,
  incompleteBlockchains,
  loading,
  addressNickName,
  isUnsupported,
}) => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const addresses = useSelector((state) => state.addressName.addresses);
  const { userPortfolioSummary } = useSelector((state) => state.userWallets);

  console.log('user portfolio summary', userPortfolioSummary);

  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [formattedAddressLabel, setFormattedAddressLabel] = useState('');
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    if (!userPortfolioSummary?.addresses)
      return;

    const currentFormattedValue = formatIdTransaction(address, 6, 8);
    setFormattedValue(currentFormattedValue);

    let matchingAddress;

    if (user) {
      matchingAddress = userPortfolioSummary?.addresses?.find(
        (addr) => addr.address === address,
      );
    }

    if (!matchingAddress) {
      matchingAddress = addresses?.find((addr) => addr.value === address);
    }

    if (matchingAddress) {
      setFormattedAddressLabel(
        matchingAddress.name || matchingAddress.label || currentFormattedValue,
      );
    } else {
      setFormattedAddressLabel(currentFormattedValue);
    }
  }, [address, user, userPortfolioSummary, addresses]);

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

  const handleOpenModalRename = (e, option) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleRenameAddress = (value, newName) => {
    dispatch(setAddressName({ value, label: newName || null }));
  };

  console.log('userPortfolioSummary', userPortfolioSummary);

  const handleUpdateAddress = (e, address) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('address update', address);

    Swal.fire({
      title: 'Rename Wallet',
      input: 'text',
      html: `
      <span class="fs-6 align-items-start border rounded bg-light" >${address.address}</span>
    `,
      inputValue: address.name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      // inputValidator: (value) => {
      //   if (
      //     userPortfolioSummary.addresses.some(
      //       (addr) => addr.name === value && addr.address !== address.address,
      //     )
      //   ) {
      //     return 'This name already exists!';
      //   }
      // },
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
            // Actualizar el estado global si es necesario
            // Swal.fire({
            //   title: 'Success',
            //   text: 'Wallet address updated successfully',
            //   icon: 'success',
            // });
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

  const renderAddressWithDropdown = () => {
    return (
      <div className="d-flex align-items-center ms-n3">
        <h4 className="mb-0 ms-3 text-custom-address-dropdown">
          {formattedAddressLabel !== formatIdTransaction(address, 6, 8)
            ? formattedAddressLabel
            : addressNickName
              ? addressNickName
              : formattedAddressLabel}
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
              <i className="ri-qr-code-line fs-4 me-2"></i>
              <span className="fw-normal">Show QR code</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex align-items-center"
              onClick={(e) => handleCopy(e, address)}
            >
              {isCopied ? (
                <i className="ri-check-line fs-4 me-2"></i>
              ) : (
                <i className="ri-file-copy-line fs-4 me-2"></i>
              )}
              <span className="fw-normal">Copy Address</span>
            </DropdownItem>
            <DropdownItem
              className="d-flex align-items-center"
              onClick={(e) => {
                if (user) {
                  const addr = userPortfolioSummary.addresses.find(
                    (addr) => addr.address === address,
                  );

                  console.log(addr);
                  handleUpdateAddress(e, addr);
                } else {
                  handleOpenModalRename(e, {
                    label: formattedAddressLabel,
                    value: address,
                  });
                }
              }}
            >
              <i className="ri-pencil-line fs-4 me-2"></i>
              <span className="fw-normal">Rename</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  };

  return (
    <div className="">
      <QrModal
        showQrModal={showQrModal}
        toggleQrModal={toggleQrModal}
        addressTitle={address}
      />
      <div className="mt-5">
        <Col className="col-12 d-flex justify-content-between align-items-center">
          <Col className="col-7 d-flex justify-content-start align-items-center ">
            {renderAddressWithDropdown()}
          </Col>
          <Col className="col-5 d-flex justify-content-end align-items-center ">
            {loading && (
              <div className="d-flex align-items-center me-2">
                <Spinner size="md" color="primary" />
              </div>
            )}
            {!isOnlyAllNetwork && !isUnsupported && (
              <NetworkDropdown
                isAdminPage={false}
                filteredNetworks={filteredNetworks}
                incompleteBlockchains={incompleteBlockchains}
                loading={loading}
              />
            )}
          </Col>
        </Col>
      </div>
    </div>
  );
};

export default AddressWithDropdown;
