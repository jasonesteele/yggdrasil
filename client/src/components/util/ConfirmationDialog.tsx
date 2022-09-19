import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ConfirmationDialog = ({
  testid,
  title,
  message,
  open,
  onClose,
  ...rest
}: {
  testid?: string;
  title?: string;
  message: JSX.Element | string;
  open: boolean;
  onClose: (value?: boolean) => void;
}) => {
  return (
    <Dialog open={open} data-testid={testid} {...rest}>
      <DialogTitle>{title || "Please confirm"}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose()}>
          Cancel
        </Button>
        <Button onClick={() => onClose(true)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmationDialog;
