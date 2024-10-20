import React from 'react';
import useModal from './useModal'; // Custom hook for modal management
import Modal from './Modal'; // Your existing Modal component

const ImageWithModal = ({ src, alt }) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      {/* Image that will trigger the modal */}
      <img
        src={src}
        alt={alt}
        onClick={openModal}
        style={{ width: "200px", cursor: "pointer" }}
      />

      {/* Modal component */}
      <Modal show={isOpen} onClose={closeModal}>
        <img
          src={src} // Same image, enlarged in the modal
          alt={alt}
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default ImageWithModal;
