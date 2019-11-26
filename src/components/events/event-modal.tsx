import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import {EventForm} from './event-form';

export const EventModal = ({close, isOpen}) => {
  return (
    <Modal closeable={false} onClose={close} isOpen={isOpen}>
      <ModalHeader>Create Event</ModalHeader>
      <ModalBody>
        <EventForm></EventForm>
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={close}>Cancel</ModalButton>
        <ModalButton onClick={close}>Okay</ModalButton>
      </ModalFooter>
    </Modal>
  );
};
