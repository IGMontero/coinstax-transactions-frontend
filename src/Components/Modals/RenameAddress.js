import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from 'reactstrap';

const RenameAddressModal = ({ open, setOpen, onSave, address }) => {
  const [newAddress, setNewAddress] = useState(address);

  useEffect(() => {
    setNewAddress(address);
  }, [address, open]);

  const handleSave = () => {
    onSave(newAddress);
    setOpen(false);
  };

  return (
    <Modal isOpen={open} toggle={() => setOpen(false)}>
      <ModalHeader toggle={() => setOpen(false)}>Rename address</ModalHeader>
      <ModalBody>
        <Input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>
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
