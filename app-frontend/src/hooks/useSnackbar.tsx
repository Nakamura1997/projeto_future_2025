// src/hooks/useSnackbar.tsx
import { useState } from "react";

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<{ message: string, type: "success" | "error" | "info" } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error" | "info" = "info") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 4000); // fecha após 4s
  };

  const SnackbarComponent = () => snackbar ? (
    <div className={`snackbar ${snackbar.type}`}>
      {snackbar.message}
    </div>
  ) : null;

  return { showSnackbar, SnackbarComponent };
};
