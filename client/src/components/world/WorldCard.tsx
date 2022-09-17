import { Box, Typography } from "@mui/material";

const WorldCard = ({ world }: { world: World }) => {
  if (!world) return null;

  return (
    <Box>
      <Typography>{world.name}</Typography>
      <Typography>{world.description}</Typography>
    </Box>
  );
};
export default WorldCard;
