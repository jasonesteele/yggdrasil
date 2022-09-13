import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { handleLogin } from "../providers/SessionProvider";

const Signin = () => {
  const [searchParams] = useSearchParams();

  return (
    <Box pt={5}>
      <Container maxWidth="sm">
        <Grid container spacing={2} p={2}>
          {searchParams.get("error") && (
            <Grid item xs={12}>
              <Alert severity="error">
                <AlertTitle>Login Error</AlertTitle>
                Failed to login
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="body2">
                  “Yggdrasil is the Tree of Life,’ he says. ‘Its branches cover
                  the world and stretch up to the sky. But it has only three
                  roots. One is submerged in the waters of the Pool of
                  Knowledge. Another in fire. The last root is being devoured by
                  a terrible creature. When two of its roots have been consumed
                  by fire and beast, the tree will fall, and eternal darkness
                  will spread across the world.”
                </Typography>
                <Typography variant="caption">
                  Twan Eng Tan, The Garden of Evening Mists
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <List>
              <ListItem>
                <span>
                  <Link onClick={handleLogin}>Log in</Link> via Discord
                </span>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Signin;
