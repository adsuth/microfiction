"use client"
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  Link,
} from "@mui/material"
import AllInclusive from "@mui/icons-material/AllInclusive"
import MenuIcon from "@mui/icons-material/Menu"
import { locale } from "@/lib/utils"
import HeaderActionMenu from "./menus/HeaderActionMenu"
import HudMessage from "@/components/HudMessage"
import PopulateActionMenu from "./menus/PopulateActionMenu"

export default function SiteHeader()
{  
  // https://mui.com/material-ui/react-avatar/ // for avatar
  return (
    <>
      <HudMessage />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link
              href="/"
              sx={{
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                gap: 1,
                placeItems: "center",
              }}
            >
              <AllInclusive />
              <Typography variant="h6">{locale( "misc.microfiction" )}</Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => {}}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={false}
                onClose={() => {}} // todo
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {[].map(
                  (
                    page: any // todo
                  ) => (
                    <MenuItem key={page} onClick={() => {}}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {[].map((page: any) => (
                <Button
                  key={page}
                  onClick={() => {}} // todo
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 3, flexGrow: 0 }}>
              <PopulateActionMenu />
            </Box>
            <Box sx={{ display: "flex", gap: 3, flexGrow: 0 }}>
              <HeaderActionMenu />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
