import { Alert, AlertTitle, Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Box pt={5}>
      <Container maxWidth="sm">
        <Alert severity="error">
          <AlertTitle>Page not found</AlertTitle>
          <Typography variant="body2">
            The page you are looking for does not exist.
          </Typography>
          <Typography variant="body2">
            Return to the <Link to="/">home page</Link>
          </Typography>
        </Alert>
      </Container>
    </Box>
  );
};
export default PageNotFound;
