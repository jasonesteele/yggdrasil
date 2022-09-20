import { gql, useQuery } from "@apollo/client";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Container,
  LinearProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApolloErrorAlert from "../ApolloErrorAlert";
import Breadcrumbs from "../util/Breadcrumbs";
import SearchInput from "../util/SearchInput";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      image
      online
    }
  }
`;

const UserList = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const { data, loading, error } = useQuery(GET_USERS);
  const navigate = useNavigate();

  const filteredUsers = data?.users
    ? [...data.users].filter((user) =>
        user.name.toLowerCase().includes(searchFilter.trim().toLowerCase())
      )
    : [];
  filteredUsers.sort((a, b) => a.name.localeCompare(b.name));

  const filterCaption = (): string => {
    if (filteredUsers?.length !== data?.users?.length) {
      return `Displaying ${filteredUsers.length} of ${
        data?.users?.length
      } user${data?.users?.length === 1 ? "" : "s"}`;
    } else {
      return `Displaying ${filteredUsers.length} user${
        data?.users?.length === 1 ? "" : "s"
      }`;
    }
  };

  return (
    <Container sx={{ height: "100%" }}>
      <Breadcrumbs path={[{ label: "Home", link: "/" }]} pageLabel="Users" />
      <List
        data-testid="user-list"
        sx={{ overflowY: "auto", minHeight: 0, p: 0 }}
      >
        {!loading && error && (
          <ListItem data-testid="user-list-error" key="error">
            <Box width="100%">
              <ApolloErrorAlert title="Error loading users" error={error} />
            </Box>
          </ListItem>
        )}

        {!error && (
          <>
            <ListItem>
              <SearchInput
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                dataTestId="users-list-search"
              />
            </ListItem>
            {loading && (
              <ListItem data-testid="user-list-loading" key="progress">
                <Typography variant="caption">Loading...</Typography>
                <LinearProgress />
              </ListItem>
            )}

            {data?.users?.length > 0 && (
              <ListItem>
                <Typography variant="caption">{filterCaption()}</Typography>
              </ListItem>
            )}

            {!filteredUsers.length && (
              <Alert sx={{ mt: 2, width: "100%" }} severity="info">
                No users found
              </Alert>
            )}

            {filteredUsers.map((user, idx) => (
              <ListItem
                key={idx}
                sx={{ "&:hover": { background: "rgba(0,0,0,0.05)" } }}
                onClick={() => {
                  navigate(`/user/${user.id}`);
                }}
              >
                <Avatar
                  data-testid={`user-avatar-${idx}`}
                  sx={{
                    width: "32px",
                    height: "32px",
                    mr: 1,
                    ...(user.online
                      ? {}
                      : {
                          opacity: 0.4,
                          filter: "alpha(opacity=40)",
                        }),
                  }}
                  alt={user.name || ""}
                  src={user.image || ""}
                />
                <Typography
                  color={user.online ? "inherit" : "lightGrey"}
                  data-testid={`user-name-${idx}`}
                  variant="subtitle2"
                >
                  {user.name}{" "}
                  {user.online ? (
                    <Chip color="success" size="small" label="Online" />
                  ) : (
                    <Chip
                      disabled
                      size="small"
                      variant="outlined"
                      label="Offline"
                    />
                  )}
                </Typography>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Container>
  );
};
export default UserList;
