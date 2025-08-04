// src/components/ClientWrapper.tsx
"use client";

import { SnackbarProvider } from "notistack";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
}
