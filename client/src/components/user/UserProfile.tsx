import { gql, useQuery } from "@apollo/client";
import Edit from "@mui/icons-material/Edit";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useParams } from "react-router-dom";
import { LARGE_AVATAR_SIZE } from "../../constants";
import { useSessionContext } from "../../providers/SessionProvider";
import ApolloErrorAlert from "../ApolloErrorAlert";
import Breadcrumbs from "../util/Breadcrumbs";

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
      <Breadcrumbs
        path={[
          { label: "Home", link: "/" },
          { label: "Users", link: "/user" },
        ]}
        pageLabel={user ? user.name : " "}
      />
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
          <Typography variant="caption">
            Account created {moment(user.createdAt).calendar().toLowerCase()}
          </Typography>
          <Box>
            {user.online ? (
              <Chip color="success" size="small" label="Online" />
            ) : (
              <Chip disabled size="small" variant="outlined" label="Offline" />
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};
export default UserProfile;
