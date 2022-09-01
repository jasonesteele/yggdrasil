import {
  Avatar,
  Card,
  Link,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "src/theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatUsers = ({ users }: { users: any[] }) => {
  const mdBreakpoint = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Card sx={{ overflow: "auto", height: "100%" }}>
      <List>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {users.map((user: any, idx: number) => (
          <ListItem key={`user-${idx}`} sx={{ p: 0.75 }}>
            <Avatar
              sx={{ width: "32px", height: "32px", mr: 1 }}
              alt={user?.name || "User"}
              src={user?.image || null}
            />
            {mdBreakpoint && (
              <Link>
                <Typography variant="subtitle2">
                  {user?.name || "User"}
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
