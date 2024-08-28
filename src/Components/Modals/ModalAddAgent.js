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
import { addClientByAccountantId } from '../../slices/accountants/thunk';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { addAgentByAccountantId } from '../../slices/agents/thunks';

const AddAgentModal = ({ isOpen, setIsOpen, onRefresh }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const [agentName, setAgentName] = useState('');
  const [email, setEmail] = useState('');
  const [isShared, setIsShared] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSubmit = async () => {
    try {
      const response = await dispatch(
        addAgentByAccountantId({
          name: agentName,
          email,
          isShared,
          accountantId: userId,
        }),
      ).unwrap();

      if (response && !response.error) {
        Swal.fire({
          title: 'Success',
          text: 'Agent added successfully',
          icon: 'success',
        });
        onRefresh();
        toggleModal();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add Agent',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to add Agent: ', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add Agent',
        icon: 'error',
      });
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Add New Agent</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="agentName">Agent Name</Label>
            <Input
              type="text"
              id="agentName"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
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
              Shared Account
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Add Agent
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddAgentModal;
