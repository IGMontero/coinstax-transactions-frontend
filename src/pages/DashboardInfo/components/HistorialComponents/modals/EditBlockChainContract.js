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

  const isHistoryPage = location.pathname.includes('history');

  const [blockchainLogo, setBlockchainLogo] = useState('');
  const [blockchainName, setBlockchainName] = useState('');

  const [blockchainType, setBlockchainType] = useState('');

  const typeOptions = [
    { label: 'EMPTY', value: '' },
    { label: 'ERC20', value: 'ERC20' },
    { label: 'ERC721', value: 'ERC721' },
    { label: 'ERC1155', value: 'ERC1155' },
  ];

  useEffect(() => {
    if (transactionToEdit) {
      const defaultLogo = '';
      const defaultName = '';

      const logo = isHistoryPage
        ? transactionToEdit?.txSummary.mainContractAddressInfo?.logo ||
          defaultLogo
        : transactionToEdit?.Logo || defaultLogo;
      setBlockchainLogo(logo);

      const name = isHistoryPage
        ? transactionToEdit?.txSummary.mainContractAddressInfo?.name ||
          defaultName
        : transactionToEdit?.Name || defaultName;
      setBlockchainName(name);
      if (!isHistoryPage) {
        setBlockchainType(transactionToEdit?.Type);
      }
    }
  }, [transactionToEdit, isHistoryPage]);

  const toggleModal = () => {
    setOpen(!open);
  };

  const handleEditBlockChainContract = () => {
    let data = {};

    if (!isHistoryPage) {
      data = {
        Logo: blockchainLogo,
        Name: blockchainName,
        Type: blockchainType,
      };
    } else {
      data = {
        Logo: blockchainLogo,
        Name: blockchainName,
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
          <label htmlFor="Logo">Logo</label>
          <Input
            type="text"
            id="Logo"
            value={blockchainLogo}
            onChange={(e) => setBlockchainLogo(e.target.value)}
          />
        </div>
        {!isHistoryPage && (
          <div className="form-group mt-3">
            <label htmlFor="Type">Type</label>
            <Input
              type="select"
              id="Type"
              value={blockchainType}
              onChange={(e) => setBlockchainType(e.target.value)}
            >
              {typeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Input>
          </div>
        )}
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
