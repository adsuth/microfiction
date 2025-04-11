"use client"

import { hudMessageAtom } from "@/lib/atoms"
import { db_fetchTopThreeAuthors, db_fetchTopThreeReaders } from "@/lib/db/get"
import { locale } from "@/lib/utils"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import CloseIcon from "@mui/icons-material/Close"
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack, Typography,
} from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

interface DialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LeaderBoard(props: DialogProps) {
  const { open, setOpen } = props
  const [code, setCode] = useState<string>("")
  const [, setHudMessage] = useAtom(hudMessageAtom)

  const [topThreeAuthors, setTopThreeAuthors] = useState<UserProfile[]>([])
  const [topThreeReaders, setTopThreeReaders] = useState<UserProfile[]>([])

  useEffect(() => {
    db_fetchTopThreeAuthors()
      .then( topThree => setTopThreeAuthors(topThree) )
    db_fetchTopThreeReaders()
      .then( topThree => setTopThreeReaders(topThree) )
  }, [])

  function renderTopThree(topThree: UserProfile[])
  {
    if ( topThree.length === 0 ) return <Box sx={{display: "flex", p: 1, justifyContent: "center", alignItems: "center"}}>
      <CircularProgress />
    </Box>
    return <>
      <Typography variant="body1" fontSize={"1.4rem"} color="initial">#1 {topThree[0]?.nickname ?? locale("dialog.leaderboard.no_user")}</Typography>
      <Typography variant="body1" fontSize={"1.2rem"} color="initial">#2 {topThree[1]?.nickname ?? locale("dialog.leaderboard.no_user")}</Typography>
      <Typography variant="body1" fontSize={"1.0rem"} color="initial">#3 {topThree[2]?.nickname ?? locale("dialog.leaderboard.no_user")}</Typography>
    </>
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      {/* Close Button */}
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      
      <DialogTitle> { locale("dialog.leaderboard.title")} </DialogTitle>
      
      <DialogContent>
        <Stack direction="row" spacing={4} sx={{ width: "100%" }}>
          <Stack direction="column" sx={{ flex: 1 }}>
            <Typography variant="subtitle1" color="initial" margin="auto">Top Authors</Typography>
            {renderTopThree(topThreeAuthors)}
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="column" sx={{ flex: 1 }}>
            <Typography variant="subtitle1" color="initial" margin="auto">Top Readers</Typography>
            {renderTopThree(topThreeReaders)}
          </Stack>
        </Stack>
      
      </DialogContent>
    </Dialog>
  )
}
