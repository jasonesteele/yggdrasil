import {
  ApolloClient,
  gql,
  useApolloClient,
  useMutation,
} from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { object, string } from "yup";

export const WORLD_NAME_AVAILABILITY = gql`
  query WorldNameAvailability($name: String!) {
    worldNameAvailability(name: $name) {
      success
    }
  }
`;

export const CREATE_WORLD = gql`
  mutation CreateWorld($name: String!, $description: String) {
    createWorld(name: $name, description: $description) {
      id
    }
  }
`;

const checkWorldNameAvailability = async (
  client: ApolloClient<object>,
  value: string | undefined
): Promise<boolean> => {
  try {
    const result = await client.query({
      query: WORLD_NAME_AVAILABILITY,
      variables: { name: value },
    });
    return result?.data?.worldNameAvailability?.success;
  } catch (error) {
    return false;
  }
};

const CreateWorld = () => {
  const client = useApolloClient();
  const [worldNameAvailable, setWorldNameAvailable] = useState(true);
  const [createWorld, { loading: creating }] = useMutation(CREATE_WORLD);
  const navigate = useNavigate();

  const schema = object({
    name: string()
      .trim()
      .required()
      .min(5)
      .max(32)
      .test("clearWorldNameAvailable", "", (value) => {
        setWorldNameAvailable(true);
        return true;
      }),
    description: string()
      .trim()
      .matches(/.{10,}/, {
        excludeEmptyString: true,
        message: "description must be at least 10 characters",
      })
      .max(255),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const available = await checkWorldNameAvailability(client, data.name);
    setWorldNameAvailable(available);
    if (available) {
      try {
        await createWorld({
          variables: {
            name: data.name.trim(),
            description: data.description.trim(),
          },
        });
        // TODO: show toast for success
        navigate("/world");
      } catch (error) {
        // TODO: change this to reflect field-specific validation errors from the mutation
        // TODO: show toast for error
      }
    }
  };

  return (
    <Box height="100%" minHeight="0" display="flex" flexDirection="column">
      <Box flexGrow={1} flexShrink={1} height="100%" minHeight="0">
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
              <Typography variant="h5">Create a New World</Typography>
              <FormControl fullWidth>
                <TextField
                  required
                  error={!!errors.name || !worldNameAvailable}
                  helperText={
                    errors.name?.message?.toString() ||
                    (!worldNameAvailable ? "name is not available" : " ")
                  }
                  label="World Name"
                  variant="outlined"
                  id="world-name"
                  {...register("name")}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  error={!!errors.description}
                  helperText={errors.description?.message?.toString() || " "}
                  multiline
                  rows={3}
                  label="Short Description"
                  variant="outlined"
                  id="world-description"
                  {...register("description")}
                />
              </FormControl>
              <Stack direction="row-reverse" spacing={3} padding={1}>
                {/* TODO: Change to ProgressButton based on creating */}
                <Button
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  variant="contained"
                >
                  Create
                </Button>
                <Button component={Link} to="/world">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Container>
      </Box>
    </Box>
  );
};
export default CreateWorld;
