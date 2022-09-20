import {
  Button,
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import { Link } from "react-router-dom";
type BreadcrumbType = {
  label: string;
  link?: string;
};

const Breadcrumbs = ({
  path,
  pageLabel,
}: {
  path?: BreadcrumbType[];
  pageLabel: string;
}) => {
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      {path?.map(({ label, link }) =>
        link ? (
          <Button
            color="primary"
            size="small"
            sx={{ textTransform: "inherit", p: 0, m: 0 }}
            component={Link}
            to={link}
          >
            {label}
          </Button>
        ) : (
          <Button
            color="primary"
            size="small"
            sx={{ textTransform: "inherit", p: 0, m: 0 }}
            disabled
          >
            {label}
          </Button>
        )
      )}
      <Typography color="text.primary">{pageLabel}</Typography>
    </MuiBreadcrumbs>
  );
};
export default Breadcrumbs;
