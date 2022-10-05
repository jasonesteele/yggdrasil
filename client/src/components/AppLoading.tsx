import {
  Alert,
  Box,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";

const AppLoading = () => {
  return (
    <Box pt={5}>
      <Container maxWidth="sm">
        <Alert severity="info">
          <Typography variant="body2">Loading...</Typography>
        </Alert>
        <LinearProgress />
      </Container>
    </Box>
  );
};
export default AppLoading;
