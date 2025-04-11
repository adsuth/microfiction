import { Link } from "@mui/material";

interface Props {
  href: string;
  children: React.ReactNode;
}

/**
 * This is a wrapper for MUI's links. This is just to make them have nicer style to be honest
 */
export default function BareLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      sx={{
        color: "#374151",
        textDecoration: "none",
        placeItems: "center",
      }}
    >
      {children}
    </Link>
  );
}
