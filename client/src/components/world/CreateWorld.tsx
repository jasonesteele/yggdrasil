import {
  Box,
  Button,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const CreateWorld = () => {
  return (
    <Box height="100%" minHeight="0" display="flex" flexDirection="column">
      <Box flexGrow={1} flexShrink={1} height="100%" minHeight="0">
        <Container maxWidth="sm">
          <Stack spacing={2}>
            <Typography variant="h5">Create a new world</Typography>
            <FormControl fullWidth>
              <TextField
                label="World Name"
                variant="outlined"
                id="world-name"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                multiline
                rows={3}
                label="Short Description"
                variant="outlined"
                id="world-description"
              />
            </FormControl>
            <Stack direction="row-reverse" spacing={3} padding={1}>
              <Button disabled={true} variant="contained">
                Create
              </Button>
              <Button component={Link} to="/world">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
export default CreateWorld;
