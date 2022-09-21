import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useParams } from "react-router-dom";
import { object, string } from "yup";
import {
  LARGE_AVATAR_SIZE,
  MAX_USERNAME_LEN,
  MIN_USERNAME_LEN,
} from "../../constants";
import { useSessionContext } from "../../providers/SessionProvider";
import ApolloErrorAlert from "../ApolloErrorAlert";
import Breadcrumbs from "../util/Breadcrumbs";
import InlineEditField from "../util/InlineEditField";

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

  if (!user) return null;

  const usernameSchema = object({
    username: string()
      .trim()
      .required()
      .min(MIN_USERNAME_LEN)
      .max(MAX_USERNAME_LEN),
  });

  const validateUserName = async (value: string) => {
    try {
      await usernameSchema.validate({ username: value });
    } catch (error: any) {
      return error;
    }
  };

  const handleUserNameChange = async (newValue: string) => {
    console.log(`Updating user name to ${newValue}`);
  };

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
            <InlineEditField
              value={user.name}
              validate={validateUserName}
              onChange={handleUserNameChange}
              isEdittable={user.id === currentUser?.id}
              inputProps={{
                maxLength: MAX_USERNAME_LEN,
                "data-testid": "user-name-edit",
              }}
            />
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
