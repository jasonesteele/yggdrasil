import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useSessionContext } from "../../providers/SessionProvider";
import ApolloErrorAlert from "../ApolloErrorAlert";
import Edit from "@mui/icons-material/Edit";
import { LARGE_AVATAR_SIZE } from "../../constants";

export const GET_USER = gql`
  query GetUser($userId: String!) {
    user(id: $userId) {
      id
      name
      image
      createdAt
      online
    }
  }
`;

const UserProfile = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: id },
  });
  const { user: currentUser } = useSessionContext();

  const user = data?.user;

  return (
    <Container sx={{ height: "100%" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Button
          color="primary"
          size="small"
          sx={{ textTransform: "inherit", p: 0, m: 0 }}
          component={Link}
          to={"/"}
        >
          Home
        </Button>
        <Button
          color="primary"
          size="small"
          sx={{ textTransform: "inherit", p: 0, m: 0 }}
          component={Link}
          to={"/user"}
        >
          Users
        </Button>
        <Typography color="text.primary">{user ? user.name : " "}</Typography>
      </Breadcrumbs>
      {loading && (
        <Box>
          <Alert sx={{ width: "100%" }} severity="info">
            Loading...
          </Alert>
          <LinearProgress />
        </Box>
      )}
      {!loading && error && (
        <ApolloErrorAlert title="Error loading user" error={error} />
      )}
      {user && (
        <Box display="flex" flexDirection="column">
          <Avatar
            alt={user.name || "User"}
            sx={{ width: LARGE_AVATAR_SIZE, height: LARGE_AVATAR_SIZE }}
            src={user.image || ""}
          />
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="h6">{user.name}</Typography>
            {user.id === currentUser?.id && (
              <IconButton size="small" color="primary">
                <Edit />
              </IconButton>
            )}
          </Box>
          {user.online ? (
            <Typography color="secondary">Online</Typography>
          ) : (
            <Typography color="text.secondary">Offline</Typography>
          )}
          <Typography variant="caption">
            Account created {moment(user.createdAt).calendar().toLowerCase()}
          </Typography>
        </Box>
      )}
    </Container>
  );
};
export default UserProfile;
