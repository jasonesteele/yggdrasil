import { gql, useMutation } from "@apollo/client";
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
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import {
  MAX_WORLD_NAME_LEN,
  MIN_WORLD_DESCR_LEN,
  MIN_WORLD_NAME_LEN,
} from "../../constants";
import { useToastContext } from "../../providers/ToastProvider";
import ProgressButton from "../util/ProgressButton";

export const CREATE_WORLD = gql`
  mutation CreateWorld($name: String!, $description: String) {
    createWorld(name: $name, description: $description) {
      world {
        id
        name
      }
      validationErrors {
        field
        message
      }
    }
  }
`;

const CreateWorld = () => {
  const [validationErrors, setValidationErrors] = useState<
    { field: string; message: string }[] | undefined
  >(undefined);
  const [createWorld, { loading: creating }] = useMutation(CREATE_WORLD);
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const schema = object({
    name: string()
      .trim()
      .required()
      .min(MIN_WORLD_NAME_LEN)
      .max(MAX_WORLD_NAME_LEN)
      .test("clearValidationErrors", "", (value) => {
        setValidationErrors(undefined);
        return true;
      }),
    description: string()
      .trim()
      .matches(new RegExp(`.{${MIN_WORLD_DESCR_LEN},}`), {
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
    try {
      const response = await createWorld({
        variables: {
          name: data.name.trim().length > 0 ? data.name.trim() : undefined,
          description:
            data.description.trim().length > 0
              ? data.description.trim()
              : undefined,
        },
      });
      if (response.data.createWorld.validationErrors?.length > 0) {
        setValidationErrors(response.data.createWorld.validationErrors);
      } else {
        showToast({
          severity: "success",
          message: `Created ${response.data.createWorld.world.name}`,
        });
        navigate(`/world`);
      }
    } catch (error) {
      showToast({ severity: "error", message: (error as any).message });
    }
    // }
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
                  autoFocus
                  required
                  error={
                    !!errors.name ||
                    !!validationErrors?.find((error) => error.field === "name")
                  }
                  helperText={
                    errors.name?.message?.toString() ||
                    validationErrors
                      ?.filter((error) => error.field === "name")
                      ?.map((error) => error.message)
                      .join(", ")
                  }
                  label="World Name"
                  variant="outlined"
                  id="world-name"
                  inputProps={{
                    maxLength: MAX_WORLD_NAME_LEN,
                    "data-testid": "world-name",
                  }}
                  {...register("name")}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  error={
                    !!errors.description ||
                    !!validationErrors?.find(
                      (error) => error.field === "description"
                    )
                  }
                  helperText={
                    errors.description?.message?.toString() ||
                    validationErrors
                      ?.filter((error) => error.field === "description")
                      ?.map((error) => error.message)
                      .join(", ")
                  }
                  multiline
                  rows={3}
                  label="Short Description"
                  variant="outlined"
                  id="world-description"
                  inputProps={{
                    "data-testid": "world-description",
                  }}
                  {...register("description")}
                />
              </FormControl>
              <Stack direction="row-reverse" spacing={3} padding={1}>
                <ProgressButton
                  type="submit"
                  loading={creating}
                  disabled={Object.keys(errors).length > 0}
                  variant="contained"
                >
                  Create
                </ProgressButton>
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
