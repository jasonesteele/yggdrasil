import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import theme from "../../theme";

const InlineEditField = ({
  value,
  onChange,
  validate,
  isEdittable,
  inputProps,
}: {
  value: string;
  validate?: (newValue: string) => Promise<string | undefined>;
  onChange?: (newValue: string) => Promise<void>;
  isEdittable?: boolean;
  inputProps?: Record<string, any>;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    setIsEditting(false);
  }, [value]);

  const handleChange = async (newValue: string) => {
    setEditValue(newValue);
    if (validate) setError(await validate(newValue));
  };

  return isEditting ? (
    <TextField
      autoFocus
      size="small"
      value={editValue}
      error={!!error}
      disabled={isUpdating}
      helperText={error?.message || " "}
      onKeyDown={async (e) => {
        if (!error && e.key === "Enter") {
          try {
            setIsUpdating(true);
            onChange && (await onChange(editValue));
            setIsUpdating(false);
            setIsEditting(false);
          } catch (error) {
            setIsUpdating(false);
            setError(error);
          }
        }
      }}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={() => setIsEditting(false)}
      inputProps={inputProps}
      InputProps={{
        endAdornment: isUpdating ? (
          <InputAdornment position="end">
            <IconButton data-testid="updating-button">
              <CircularProgress
                size="16px"
                sx={{ color: theme.palette.text.secondary }}
              />
            </IconButton>
          </InputAdornment>
        ) : (
          <InputAdornment position="end">
            <IconButton
              data-testid="close-button"
              onClick={() => setIsEditting(false)}
            >
              <Close />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  ) : (
    <Box display="flex">
      <Typography variant="h6">{value}</Typography>
      {isEdittable && (
        <IconButton
          size="small"
          sx={{ color: theme.palette.text.secondary }}
          onClick={() => {
            setEditValue(value);
            setError(undefined);
            setIsEditting(true);
          }}
        >
          <Edit />
        </IconButton>
      )}
    </Box>
  );
};

export default InlineEditField;
