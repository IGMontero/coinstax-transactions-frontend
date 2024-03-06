import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';

const EditBlockChainContract = ({
  open,
  setOpen,
  transactionToEdit,
  onEdit,
  loading,
}) => {
  const [blockchainLogo, setBlockchainLogo] = useState('');
  const [blockchainName, setBlockchainName] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setBlockchainLogo(
        transactionToEdit.blockchainLogo || transactionToEdit.Logo || '',
      );
      setBlockchainName(
        transactionToEdit.blockchainName || transactionToEdit.Name || '',
      );
    }
  }, [transactionToEdit]);

  const toggleModal = () => {
    setOpen(!open);
  };

  const handleEditBlockChainContract = () => {
    const data = {
      Logo: blockchainLogo,
      Name: blockchainName,
    };
    onEdit(data);
  };

  return (
    <Modal isOpen={open} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Edit BlockChain Contract</ModalHeader>
      <ModalBody>
        <div className="form-group ">
          <label htmlFor="Name"> Name</label>
          <Input
            type="text"
            id="Name"
            value={blockchainName}
            onChange={(e) => setBlockchainName(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="Logo">Logo URL</label>
          <Input
            type="text"
            id="Logo"
            value={blockchainLogo}
            onChange={(e) => setBlockchainLogo(e.target.value)}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          disabled={loading}
          color="primary"
          onClick={handleEditBlockChainContract}
        >
          {loading ? <Spinner size="sm" color="light" /> : 'Save'}
        </Button>{' '}
        <Button color="soft-danger" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBlockChainContract;
