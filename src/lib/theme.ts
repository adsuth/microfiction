"use client";
import { createTheme } from "@mui/material/styles";
import "@/style.css"

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  cssVariables: true,
});

export default theme;