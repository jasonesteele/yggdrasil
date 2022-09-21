import { gql, useQuery } from "@apollo/client";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
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

// TODO: refactor inline view/edit username textfield out to separate component

const UserProfile = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: id },
  });
  const { user: currentUser } = useSessionContext();
  const [edittingUserName, setEdittingUserName] = useState(false);
  const [editUserName, setEditUserName] = useState<String>("");
  const [editUserNameError, setEditUserNameError] = useState<any>(undefined);

  useEffect(() => setEdittingUserName(false), [id]);

  const user = data?.user;

  if (!user) return null;

  const schema = object({
    username: string()
      .trim()
      .required()
      .min(MIN_USERNAME_LEN)
      .max(MAX_USERNAME_LEN),
  });

  const handleUserNameChange = async (newValue: string) => {
    setEditUserName(newValue);
    try {
      await schema.validate({ username: newValue });
      setEditUserNameError(undefined);
    } catch (error: any) {
      setEditUserNameError(error);
    }
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
            {edittingUserName ? (
              <Box display="flex">
                <TextField
                  autoFocus
                  size="small"
                  value={editUserName}
                  error={editUserNameError}
                  helperText={editUserNameError?.message}
                  onKeyDown={(e) => {
                    if (!editUserNameError && e.key === "Enter") {
                      console.log(`Changing name to ${editUserName}`);
                      // TODO: Post mutation and do server-side validation (uniqueness, etc.), create new user event
                      // setEdittingUserName(false); if update is successful, otherwise set error
                    }
                  }}
                  onChange={(e) => handleUserNameChange(e.target.value)}
                  onBlur={() => setEdittingUserName(false)}
                  inputProps={{
                    maxLength: MAX_USERNAME_LEN,
                    "data-testid": "user-name-edit",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          data-testid="user-name-edit-close"
                          onClick={() => setEdittingUserName(false)}
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ) : (
              <Box display="flex">
                <Typography variant="h6">{user.name}</Typography>
                {user.id === currentUser?.id && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setEditUserName(user.name);
                      setEditUserNameError(undefined);
                      setEdittingUserName(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Box>
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
