import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../theme";

const WorldCard = ({
  world,
  onSelect,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  world: any;
  onSelect?: (worldId: string) => void;
}) => {
  const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));

  const onlineCount = world?.users?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (users: any) => users.online
  )?.length;

  return (
    <Card
      data-testid="world-card"
      sx={{
        display: "flex",
        "&:hover": { background: "rgba(0,0,0,0.05)" },
      }}
      onClick={() => {
        if (world?.id && onSelect) {
          onSelect(world.id);
        }
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
          image={world.image || "/world.svg"}
          alt={`${world.name} Thumbnail`}
        />
      )}
      <CardContent
        sx={{
          width: "100%",
          borderLeft: !breakpoint
            ? `20px solid ${theme.palette.secondary.light}`
            : "inherit",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography data-testid="world-name" color="primary" variant="h6">
            {world?.name || <i>Untitled</i>}
          </Typography>
          <Chip
            data-testid="world-online-counter"
            color={onlineCount > 0 ? "success" : "default"}
            sx={{ ml: "0.5em" }}
            size="small"
            label={onlineCount || "0"}
          />
        </Box>
        <Typography
          data-testid="world-description"
          variant="subtitle2"
          color="text.secondary"
          component="div"
        >
          {world?.description || <i>No description available</i>}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default WorldCard;
