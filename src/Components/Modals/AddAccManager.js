import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Button,
  Spinner,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { addAccountManager } from '../../slices/userWallets/thunk';

const AddAccManager = ({ isOpen, setIsOpen, userId }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const toggleModal = () => setIsOpen(!isOpen);

  const handleAddAccountManager = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(
        addAccountManager({
          userId,
          email,
        }),
      ).unwrap();

      if (response && !response.error) {
        Swal.fire({
          title: 'Success',
          text: 'Account Manager invited successfully.',
          icon: 'success',
        });
        setEmail('');
        toggleModal();
      } else {
        Swal.fire({
          title: 'Error',
          text: response?.message || 'Failed to add invite code.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: 'Error',
        text: 'Failed to add invite code.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Add Account Manager</ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <InputGroup>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter account manager email"
                required
                aria-label="Email address for account manager"
              />
              <Button
                disabled={loading || !email}
                color="primary"
                onClick={handleAddAccountManager}
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

export default AddAccManager;
