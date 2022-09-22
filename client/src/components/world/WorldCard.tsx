import Close from "@mui/icons-material/Close";
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
import theme from "../../theme";
import ConfirmationDialog from "../util/ConfirmationDialog";

const WorldCard = ({
  world,
  onDelete,
}: {
  world: World;
  onDelete?: (world: World) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { user } = useSessionContext();
  const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));

  if (!world) return null;

  return (
    <Card
      elevation={5}
      sx={{
        display: "flex",
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
                data-testid="close-world-button"
                size="small"
                onClick={() => {
                  setConfirmOpen(true);
                }}
              >
                <Close fontSize="small" />
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
          <Alert severity="warning">
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
