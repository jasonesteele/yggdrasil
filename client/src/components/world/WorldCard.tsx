import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme";

const WorldCard = ({ world }: { world: World }) => {
  const breakpoint = useMediaQuery(theme.breakpoints.up("sm"));

  if (!world) return null;

  return (
    <Card
      elevation={5}
      sx={{
        display: "flex",
        height: "100%",
        "&:hover": { background: "rgba(0,0,0,0.05)" },
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
        <Typography color="primary" variant="h6">
          {world.name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ lineHeight: "1.5em", height: "3em", maxHeight: "3em" }}
        >
          {world.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default WorldCard;
