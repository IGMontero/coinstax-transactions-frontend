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
} from 'reactstrap';
import { addClient } from '../../slices/clients/thunk';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const AddClientModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [isShared, setIsShared] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    const newClient = {
      clientName,
      email,
      isShared,
      userId,
    };

    try {
      const response = await dispatch(addClient(newClient)).unwrap();

      console.log(response);

      if (response && !response.error) {
        Swal.fire({
          title: 'Success',
          text: 'Client added successfully',
          icon: 'success',
        });
        toggleModal();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add client',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to add client: ', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add client',
        icon: 'error',
      });
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Add New Client</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="clientName">Client Name</Label>
            <Input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
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
          Add Client
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddClientModal;