import { ApolloError, ServerError } from "@apollo/client";
import { Alert, AlertTitle, List, ListItem } from "@mui/material";

const ApolloErrorAlert = ({
  title,
  error,
}: {
  title: string;
  error: ApolloError;
}) => {
  console.error(error);

  return (
    <Alert
      severity="error"
      sx={{ maxHeight: "200px", overflow: "auto", width: "100%" }}
    >
      <AlertTitle>{title}</AlertTitle>
      <List sx={{ p: 0 }}>
        {error.graphQLErrors &&
          error.graphQLErrors.map(({ message }, idx) => (
            <ListItem key={`graphql-error-${idx}`} sx={{ p: 0 }}>
              {message}
            </ListItem>
          ))}
        {error.clientErrors &&
          error.clientErrors.map(({ message }, idx) => (
            <ListItem key={`client-error-${idx}`} sx={{ p: 0 }}>
              {message}
            </ListItem>
          ))}
        {error.networkError?.message && (
          <ListItem key={`network-error`} sx={{ p: 0 }}>
            {error.networkError?.message}
          </ListItem>
        )}
        {(error.networkError as ServerError)?.result?.errors?.length &&
          (error.networkError as ServerError)?.result?.errors?.map(
            ({ message }: { message: string }, idx: number) => (
              <ListItem key={`network-error-${idx}`} sx={{ p: 0 }}>
                {message}
              </ListItem>
            )
          )}
      </List>
    </Alert>
  );
};
export default ApolloErrorAlert;
