import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from 'reactstrap';
import { addUserWallet } from '../../slices/userWallets/thunk';
import Swal from 'sweetalert2';

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

      console.log(response);

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
          text: 'Failed to connect wallet',
          icon: 'error',
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to connect wallet',
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
            <div className="d-flex align-items-center">
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
                  className=""
                  onClick={handleSubmit}
                >
                  {loading ? <Spinner size="sm" color="primary" /> : 'Add'}
                </Button>
              </InputGroup>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ConnectWalletModal;
