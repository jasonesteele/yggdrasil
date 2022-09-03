import {
  Avatar,
  Card,
  Link,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { NexusGenRootTypes } from "src/nexus-typegen";
import theme from "src/theme";

const ChatUsers = ({ users }: { users: NexusGenRootTypes["User"][] }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List sx={{ p: 0 }}>
        {users.map((user: NexusGenRootTypes["User"], idx: number) => (
          <ListItem key={`user-${idx}`} sx={{ p: 0.5 }}>
            <Avatar
              data-testid={`user-avatar-${idx}`}
              sx={{ width: "32px", height: "32px", mr: 1 }}
              alt={user.name || ""}
              src={user.image || ""}
            />
            {mdBreakpoint && (
              <Link>
                <Typography
                  data-testid={`user-name-${idx}`}
                  variant="subtitle2"
                >
                  {user?.name}
                </Typography>
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
export default ChatUsers;
