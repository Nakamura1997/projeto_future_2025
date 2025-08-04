// components/Snackbar.tsx
"use client";
import { useEffect, useState } from "react";

interface SnackbarProps {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export default function Snackbar({ message, type = "success", onClose }: SnackbarProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`snackbar ${type}`}>
        
      {message}
    </div>
  );
}
