import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Button,
  Spinner,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { addUserWallet } from '../../slices/userWallets/thunk';

const ConnectWalletModal = ({ isOpen, setIsOpen, onRefresh, userId }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        addUserWallet({ address, userId }),
      ).unwrap();

      if (response && !response.error) {
        Swal.fire({
          title: 'Success',
          text: 'Wallet connected successfully',
          icon: 'success',
        });

        onRefresh();
        setAddress('');
        toggleModal();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'Failed to connect wallet',
          icon: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: error || 'Failed to connect wallet',
        icon: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Connect Wallet</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="address">Wallet Address</Label>
            <InputGroup>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter wallet address"
              />
              <Button
                disabled={loading || !address}
                color="primary"
                onClick={handleSubmit}
              >
                {loading ? <Spinner size="sm" color="light" /> : 'Add'}
              </Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ConnectWalletModal;
