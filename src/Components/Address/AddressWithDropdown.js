import React, { useEffect, useState } from 'react';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import QrModal from '../Modals/QrModal';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { setAddressName } from '../../slices/addressName/reducer';
import { copyToClipboard, formatIdTransaction } from '../../utils/utils';
import NetworkDropdown from '../NetworkDropdown/NetworkDropdown';

const AddressWithDropdown = ({
  filteredNetworks,
  isOnlyAllNetwork,
  incompleteBlockchains,
  loading,
}) => {
  const { address } = useParams();
  const dispatch = useDispatch();

  const [showQrModal, setShowQrModal] = useState(false);
  const [isCopied, setIsCopied] = useState(null);
  const [formattedAddressLabel, setFormattedAddressLabel] = useState('');
  const [formattedValue, setFormattedValue] = useState('');

  const addresses = useSelector((state) => state.addressName.addresses);

  useEffect(() => {
    const matchingAddress = addresses.find((addr) => addr.value === address);
    const currentFormattedValue = formatIdTransaction(address, 6, 8);
    setFormattedValue(currentFormattedValue);

    if (matchingAddress) {
      setFormattedAddressLabel(matchingAddress.label || currentFormattedValue);
    } else {
      setFormattedAddressLabel(currentFormattedValue);
    }
  }, [address, addresses]);

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

  const handleRenameAddress = (value, newName) => {
    dispatch(setAddressName({ value, label: newName || null }));
  };

  const renderAddressWithDropdown = () => {
    return (
      <div className="d-flex align-items-center ms-n3">
        <h4 className="mb-0 ms-3  text-custom-address-dropdown ">
          {formattedAddressLabel}
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
              onClick={(e) =>
                handleOpenModalRename(e, {
                  label: formattedAddressLabel,
                  value: address,
                })
              }
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
          <Col className="col-8 d-flex justify-content-start align-items-center ">
            {renderAddressWithDropdown()}
          </Col>
          <Col className="col-4 d-flex justify-content-end align-items-end ">
            {!isOnlyAllNetwork && (
              <NetworkDropdown
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
