import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

const EditBlockChainContract = ({ open, setOpen, transactionToEdit }) => {
  console.log('transaction to edit', transactionToEdit);
  const [marketplaceLogo, setMarketplaceLogo] = useState('');
  const [marketplaceName, setMarketplaceName] = useState('');

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <Modal isOpen={open} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Edit BlockChain Contract</ModalHeader>
      <ModalBody>
        <div className="form-group ">
          <label htmlFor="marketplaceName"> Name</label>
          <Input
            type="text"
            id="marketplaceName"
            value={transactionToEdit?.marketplaceName || ''}
            onChange={(e) => setMarketplaceName(e.target.value)}
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="marketplaceLogo">Marketplace Logo URL</label>
          <Input
            type="text"
            id="marketplaceLogo"
            value={transactionToEdit?.marketplaceLogo || ''}
            onChange={(e) => setMarketplaceLogo(e.target.value)}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => {}}>
          Save Changes
        </Button>{' '}
        <Button color="soft-danger" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBlockChainContract;
