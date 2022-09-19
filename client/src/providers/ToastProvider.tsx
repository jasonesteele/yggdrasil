import { Alert, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext<ToastContextData>({ showToast: () => {} });

export const useToastContext = () => useContext(ToastContext);

const ToastProvider = ({ children }: { children: JSX.Element }) => {
  const [toast, setToast] = useState<Toast | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const showToast = (toast: Toast) => {
    setToast(toast);
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {toast && (
          <Alert onClose={handleClose} severity={toast.severity}>
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </ToastContext.Provider>
  );
};
export default ToastProvider;
