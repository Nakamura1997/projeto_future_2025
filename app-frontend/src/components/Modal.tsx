"use client";
import { FiX, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import React, { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isFullScreen ? "fullscreen-overlay" : ""}`}
      onClick={!isFullScreen ? onClose : undefined}
    >
      <div
        className={`${isFullScreen ? "fullscreen-modal" : "modal-report "}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <div className="modal-header-buttons">
            <button
              onClick={() => setIsFullScreen((prev) => !prev)}
              className="btn-toggle-fullscreen"
              aria-label="Alternar tela cheia"
            >
              {isFullScreen ? (
                <FiMinimize2 size={20} />
              ) : (
                <FiMaximize2 size={20} />
              )}
            </button>
            <button
              onClick={onClose}
              className="btn-close"
              aria-label="Fechar modal"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
