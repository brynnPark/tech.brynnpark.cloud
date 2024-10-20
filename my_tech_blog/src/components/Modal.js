// src/components/Modal.js
import React from 'react';
import './Modal.css'; // Ensure your modal styles are imported

const Modal = ({ show, onClose, children }) => {
  if (!show) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">Image Modal</h4>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <div className="modal-body">
          {children} {/* Render the image or other content */}
        </div>
      </div>
    </div>
  );
};

export default Modal;
