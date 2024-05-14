import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from 'reactstrap';
import Swal from 'sweetalert2';

const RenameAddressModal = ({ open, setOpen, onSave, address, options }) => {
  const [newAddress, setNewAddress] = useState(address);
  const [originalAddress, setOriginalAddress] = useState(address);

  const checkIfNameExists = (name) => {
    return options.some((option) => option.label === name);
  };

  useEffect(() => {
    if (open) {
      setNewAddress(address);
      setOriginalAddress(address);
    }
  }, [open, address]);

  const handleSave = () => {
    if (checkIfNameExists(newAddress)) {
      Swal.fire({
        title: 'Error',
        text: 'Address name already exists',
        icon: 'error',
      });
      return;
    }

    onSave(newAddress);
    setOpen(false);
    Swal.fire('Updated!', 'Your address has been renamed.', 'success');
  };

  return (
    <Modal isOpen={open} toggle={() => setOpen(false)}>
      <ModalHeader toggle={() => setOpen(false)}>Rename Wallet</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          className="form-control"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleSave}
          disabled={newAddress === originalAddress}
        >
          Save
        </Button>
        <Button color="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RenameAddressModal;
