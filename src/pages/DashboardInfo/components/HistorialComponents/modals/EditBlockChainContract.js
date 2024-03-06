import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  console.log(transactionToEdit);

  const isHistoryPage = location.pathname.includes('history');

  const [blockchainLogo, setBlockchainLogo] = useState('');
  const [blockchainName, setBlockchainName] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setBlockchainLogo(
        isHistoryPage
          ? transactionToEdit?.txSummary.marketplaceLogo
          : transactionToEdit?.Logo || '',
      );
      setBlockchainName(
        isHistoryPage
          ? transactionToEdit?.txSummary.marketplaceName
          : transactionToEdit?.Name || '',
      );
    }
  }, [transactionToEdit]);

  const toggleModal = () => {
    setOpen(!open);
  };

  const handleEditBlockChainContract = () => {
    let data = {};

    if (!isHistoryPage) {
      data = {
        Logo: blockchainLogo,
        Name: blockchainName,
      };
    } else {
      data = {
        marketplaceLogo: blockchainLogo,
        marketplaceName: blockchainName,
      };
    }
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
