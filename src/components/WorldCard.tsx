import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  Popover,
  Typography,
} from "@mui/material";
import { useState } from "react";
import theme from "../theme";

const WorldCard = ({
  world,
  onSelect,
}: {
  world: any;
  onSelect?: (worldId: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onlineCount = world?.users?.filter(
    (users: any) => users.online
  )?.length;

  return (
    <Card
      elevation={5}
      sx={{
        display: "flex",
        "&:hover": { background: "rgba(0,0,0,0.1)" },
      }}
      onClick={() => {
        if (world?.id && onSelect) {
          onSelect(world.id);
        }
      }}
    >
      <CardMedia
        component="img"
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
      <CardContent
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography color="primary" variant="h6">
            {world?.name || <i>Untitled</i>}
          </Typography>
          <Chip
            color={onlineCount > 0 ? "success" : "default"}
            sx={{ ml: "1em" }}
            label={onlineCount || "0"}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
          {onlineCount > 0 && (
            <Popover
              id="online-users-popover"
              sx={{ pointerEvents: "none" }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <List sx={{ pb: "0", pt: "5" }}>
                {world?.users?.map((user: any) => (
                  <ListItem sx={{ pt: "0", pb: "5" }}>
                    <Avatar
                      sx={{ width: 24, height: 24 }}
                      alt={user.name || "User"}
                      src={user.image || ""}
                    />
                    <Typography sx={{ ml: "0.4em" }}>{user.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </Popover>
          )}
          <Box
            sx={{
              flex: "1 0 auto",
              justifyContent: "right",
              alignItems: "center",
            }}
            display={{ md: "flex", xs: "none" }}
          >
            <Avatar
              sx={{ width: 24, height: 24 }}
              alt={world?.owner?.name || "User"}
              src={world?.owner?.image || ""}
            />
            <Typography sx={{ pl: "0.4em" }} component="span">
              {world?.owner?.name}
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" component="div">
          {world?.description || <i>No description available</i>}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default WorldCard;
