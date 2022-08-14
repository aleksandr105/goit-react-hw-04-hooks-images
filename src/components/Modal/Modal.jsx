import { ModalImg, Backdrop } from './Modal.styled';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ showModal, children }) => {
  useEffect(() => {
    window.addEventListener('keydown', showModal);

    return () => window.removeEventListener('keydown', showModal);
  }, [showModal]);

  return createPortal(
    <Backdrop>
      <ModalImg>{children}</ModalImg>
    </Backdrop>,
    modalRoot
  );
};

Modal.propTypes = {
  showModal: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
};
