import { gql, useMutation } from "@apollo/client";
import Close from "@mui/icons-material/Close";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PersonRemove from "@mui/icons-material/PersonRemove";
import PlayArrow from "@mui/icons-material/PlayArrow";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSessionContext } from "../../providers/SessionProvider";
import { useToastContext } from "../../providers/ToastProvider";
import theme from "../../theme";
import ConfirmationDialog from "../util/ConfirmationDialog";

export const JOIN_WORLD = gql`
  mutation JoinWorld($worldId: String!) {
    joinWorld(worldId: $worldId) {
      success
    }
  }
`;
export const LEAVE_WORLD = gql`
  mutation LeaveWorld($worldId: String!) {
    leaveWorld(worldId: $worldId) {
      success
    }
  }
`;

const WorldCard = ({
  world,
  onDelete,
}: {
  world: World;
  onDelete?: (world: World) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user } = useSessionContext();
  const { showToast } = useToastContext();
  const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  const [joinWorld] = useMutation(JOIN_WORLD);
  const [leaveWorld] = useMutation(LEAVE_WORLD);

  if (!world) return null;

  const isMember = world.users.find((worldUser) => worldUser.id === user?.id);
  const isOwner = world.owner.id === user?.id;

  const handleWorldJoin = async (world: World) => {
    try {
      await joinWorld({
        variables: { worldId: world.id },
      });

      showToast({
        severity: "success",
        message: `Joined ${world.name}`,
      });
    } catch (error) {
      showToast({ severity: "error", message: (error as any).message });
    }
  };

  const handleWorldLeave = async (world: World) => {
    try {
      await leaveWorld({
        variables: { worldId: world.id },
      });

      showToast({
        severity: "success",
        message: `Left ${world.name}`,
      });
    } catch (error) {
      showToast({ severity: "error", message: (error as any).message });
    }
  };

  return (
    <Card
      elevation={isMember ? 5 : 1}
      sx={{
        display: "flex",
        ...(isMember
          ? { border: "1px solid darkgrey" }
          : { background: "ghostwhite" }),
        height: "100%",
        "&:hover": { background: "rgba(0,0,0,0.05)" },
        "& .buttonBox": { visibility: "hidden" },
        ...(onDelete
          ? {
              "&:hover .buttonBox": { visibility: "visible" },
            }
          : {}),
      }}
    >
      {breakpoint && (
        <CardMedia
          component="img"
          data-testid="world-media"
          sx={{
            width: "90px",
            minHeight: "90px",
            objectFit: "contain",
            p: "5px",
            background: theme.palette.secondary.light,
          }}
          image={world?.image || "/world.svg"}
          alt={`${world?.name} Thumbnail`}
        />
      )}
      <CardContent
        sx={{
          p: 2,
          pt: 0,
          pb: 0,
          width: "100%",
          maxHeight: "150px",
          borderLeft: !breakpoint
            ? `20px solid ${theme.palette.secondary.light}`
            : "inherit",
        }}
      >
        <Box display="flex" alignItems="middle">
          <Typography color="primary" variant="h6">
            {world.name}
          </Typography>
          <Box sx={{ ml: 1, flexGrow: 1 }}>
            <Button
              color="secondary"
              sx={{ textTransform: "inherit" }}
              component={Link}
              to={`/user/${world.owner.id}`}
            >
              <Typography color="black" variant="subtitle2">
                {world.owner.name}
              </Typography>
            </Button>
          </Box>
          <Box className="buttonBox">
            {user?.id === world.owner.id && (
              <IconButton
                color="error"
                data-testid="close-world-button"
                size="small"
                onClick={() => {
                  setConfirmOpen(true);
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
            {isMember && !isOwner && (
              <IconButton
                color="warning"
                data-testid="remove-from-world-button"
                size="small"
                onClick={() => handleWorldLeave(world)}
              >
                <PersonRemove fontSize="small" />
              </IconButton>
            )}
            {isMember ? (
              <IconButton
                color="primary"
                data-testid="join-world-button"
                size="small"
              >
                <PlayArrow fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                data-testid="add-to-world-button"
                size="small"
                onClick={() => handleWorldJoin(world)}
              >
                <PersonAdd fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ lineHeight: "1.5em", height: "3em", maxHeight: "3em" }}
        >
          {world.description}
        </Typography>
      </CardContent>
      <ConfirmationDialog
        message={
          <Alert severity="error">
            <Typography variant="subtitle1">Delete {world.name}?</Typography>
            <Typography variant="body2">
              This action can not be undone.
            </Typography>
          </Alert>
        }
        open={confirmOpen}
        onClose={(value) => {
          setConfirmOpen(false);
          if (value && onDelete) onDelete(world);
        }}
      />
    </Card>
  );
};
export default WorldCard;
