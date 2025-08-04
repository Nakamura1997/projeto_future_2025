// components/ConfirmDialog.tsx
"use client";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmDialogProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title = "Confirmação",
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <FiAlertTriangle size={32} className="dialog-icon" />
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
