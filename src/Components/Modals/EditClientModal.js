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
import { updateUserWalletAddress } from '../../slices/clients/thunk';

const EditClientModal = ({ isOpen, setIsOpen, selectedUser }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setAddress(selectedUser.address);
      setIsShared(selectedUser.isShared);
    }
  }, [selectedUser]);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    const updatedUser = {
      ...selectedUser,
      name,
      email,
      address,
      isShared,
    };

    try {
      const response = await dispatch(
        updateUserWalletAddress(updatedUser),
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
            <Label for="address">Address</Label>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </FormGroup>
          <FormGroup>
            <Label for="name">Client Name</Label>
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
              {/* Text for checkbox */}
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
