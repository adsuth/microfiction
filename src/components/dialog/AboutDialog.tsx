"use client"

import { hudMessageAtom } from "@/lib/atoms"
import { db_fetchTopThreeAuthors, db_fetchTopThreeReaders } from "@/lib/db/get"
import { locale } from "@/lib/utils"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import CloseIcon from "@mui/icons-material/Close"
import GitHubIcon from '@mui/icons-material/GitHub';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import Microfiction from "../misc/Microfiction"

interface DialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AboutDialog(props: DialogProps) {
  const { open, setOpen } = props

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      {/* Close Button */}
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle> {locale("dialog.about.title")} </DialogTitle>

      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <Microfiction height={100}/>
          <Typography variant="body1">
            {locale("dialog.about.content")}
          </Typography>
          <Typography variant="body1">
            {locale("dialog.about.footer")}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{m: "auto"}}>
        <Link href="https://github.com/adsuth/microfiction/">
          <IconButton>
            <GitHubIcon/>
          </IconButton>
        </Link>
      </DialogActions>
    </Dialog>
  )
}
