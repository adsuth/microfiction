"use client"
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Link,
  Stack,
} from "@mui/material"
import { locale } from "@/lib/utils"
import HeaderActionMenu from "./menus/HeaderActionMenu"
import HudMessage from "@/components/HudMessage"
import PopulateActionMenu from "./menus/PopulateActionMenu"
import Microfiction from "./misc/Microfiction"

export default function SiteHeader() {
  return (
    <>
      <HudMessage />
      <AppBar position="static" sx={{ width: "100%" }}>
        <Container>
          <Toolbar
            disableGutters
            sx={{ w: "100%", justifyContent: "space-between" }}
          >
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
              <Microfiction fill={"#fff"} height={"2rem"} />
              <Typography
                variant="h6"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                }}
              >
                {locale("misc.microfiction")}
              </Typography>
            </Link>

            <Stack direction={"row"} sx={{ placeItems: "center" }}>
              <PopulateActionMenu />
              <HeaderActionMenu />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
