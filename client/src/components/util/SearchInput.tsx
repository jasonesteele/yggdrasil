import Close from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import theme from "../../theme";

const SearchInput = ({
  searchFilter,
  setSearchFilter,
  dataTestId,
}: {
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  dataTestId?: string;
}) => {
  return (
    <TextField
      label="Search"
      size="small"
      fullWidth
      value={searchFilter}
      onChange={(e) => setSearchFilter(e.target.value)}
      sx={{ backgroundColor: theme.palette.background.paper }}
      InputProps={{
        ...(dataTestId ? { "data-testid": dataTestId } : {}),
        endAdornment: (
          <>
            {searchFilter.trim().length > 0 ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchFilter("")}>
                  <Close />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <IconButton disabled={true}>
                  <Search />
                </IconButton>
              </InputAdornment>
            )}
          </>
        ),
      }}
    />
  );
};

export default SearchInput;
