import { ApolloError } from "@apollo/client";
import { Alert, AlertTitle, List, ListItem } from "@mui/material";

const ApolloErrorAlert = ({
  title,
  error,
}: {
  title: string;
  error: ApolloError;
}) => {
  return (
    <Alert severity="error" sx={{ maxHeight: "200px", overflow: "auto" }}>
      <AlertTitle>{title}</AlertTitle>
      <List sx={{ p: 0 }}>
        {error.graphQLErrors &&
          error.graphQLErrors.map(({ message }, idx) => (
            <ListItem key={`graphql-error-${idx}`} sx={{ p: 0 }}>
              {message}
            </ListItem>
          ))}
        {error.networkError && (
          <ListItem key={`network-error`} sx={{ p: 0 }}>
            {error.networkError.message}
          </ListItem>
        )}
      </List>
    </Alert>
  );
};
export default ApolloErrorAlert;
