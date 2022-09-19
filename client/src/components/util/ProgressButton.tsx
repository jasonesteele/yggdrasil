import { Button, ButtonProps, CircularProgress } from "@mui/material";

const ProgressButton = ({
  children,
  loading,
  disabled,
  ...rest
}: { loading: boolean } & ButtonProps) => {
  return (
    <Button disabled={disabled || loading} {...rest}>
      {children}
      {loading && (
        <CircularProgress data-testid="inherit" size={20} sx={{ ml: 1 }} />
      )}
    </Button>
  );
};
export default ProgressButton;
