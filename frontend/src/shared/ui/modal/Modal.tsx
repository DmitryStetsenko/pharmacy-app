'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'primary' | 'danger';
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  confirmType = 'primary',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key and scroll lock
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    
    // Find all focusable items inside the modal
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalElement.querySelectorAll(focusableSelector)) as HTMLElement[];
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus to the close button
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else {
      firstElement.focus();
    }

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: if on the first element, wrap to the last element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on the last element, wrap to the first element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTabTrap);
    
    return () => {
      modalElement.removeEventListener('keydown', handleTabTrap);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        // Close modal on background overlay click
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-desc"
    >
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2 id="custom-modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Закрити модальне вікно"
            ref={closeButtonRef}
          >
            &times;
          </button>
        </div>
        <div id="custom-modal-desc" className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            aria-label="Скасувати дію"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              className={`modal-btn ${
                confirmType === 'danger' ? 'modal-btn-danger' : 'modal-btn-confirm'
              }`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              aria-label="Підтвердити дію"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
