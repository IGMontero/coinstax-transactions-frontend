import React, { useState, useEffect } from 'react';
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
} from 'reactstrap';
import Swal from 'sweetalert2';
import { updateUserWalletAddress } from '../../slices/userWallets/thunk';
import { updateClientByAccountantId } from '../../slices/accountants/thunk';
import { useSelector } from 'react-redux';

const EditClientModal = ({ isOpen, setIsOpen, selectedUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const userId = user?.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.Name);
      setEmail(selectedUser.Email);
      setIsShared(selectedUser.isShared);
    }
  }, [selectedUser]);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    try {
      const response = await dispatch(
        updateClientByAccountantId({
          clientId: selectedUser.Id,
          accountantId: userId,
          name,
          email,
        }),
      ).unwrap();

      if (response && !response.error) {
        Swal.fire({
          title: 'Success',
          text: 'User updated successfully',
          icon: 'success',
        });
        toggleModal();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update user',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to update user: ', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update user',
        icon: 'error',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Edit User</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />{' '}
              Is Shared
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditClientModal;
