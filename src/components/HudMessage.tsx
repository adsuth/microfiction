"use client"
import { hudMessageAtom } from "@/lib/atoms"
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export enum HudMessageTypeEnum {
  BAD = "error",
  GOOD = "success",
  INFO = "info",
  WARN = "warning",
}

export type HudMessageType = {
  type: HudMessageTypeEnum
  message: string
  time?: number
}

export default function HudMessage() {
  const [hudMessage] = useAtom(hudMessageAtom)
  const [open, setOpen] = useState(false)

  const inferTime = () => {
    if (hudMessage?.time === Infinity) return null
    return hudMessage?.time ?? 6000
  }

  useEffect(() => {
    if (!hudMessage) return
    setOpen(true)
  }, [hudMessage])

  function onClose(
    ev?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) {
    if (reason === "clickaway") return
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={inferTime()}
      message={hudMessage?.message}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={hudMessage?.type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {hudMessage?.message}
      </Alert>
    </Snackbar>
  )
}
