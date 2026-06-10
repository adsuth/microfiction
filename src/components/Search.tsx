"use client"
import { genreAtom, queryAtom, showReadAtom } from "@/lib/atoms"
import { locale } from "@/lib/utils"
import { Box, Stack, TextField, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { GenrePicker } from "./GenrePicker"
import { Switch, FormControlLabel } from "@mui/material"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Genre } from "@/lib/defs"
import { useEffect, useState } from "react"

export default function SearchBar() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [, setQuery] = useAtom(queryAtom)

  const [showRead, setShowRead] = useAtom(showReadAtom)
  const [genre, setGenre] = useAtom(genreAtom)

  const { user, isLoading } = useUser()

  // throttle/debounce the text input; only fire after the user has stopped typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(currentQuery.toLowerCase())
    }, 400)

    return () => clearTimeout(handler)
  }, [currentQuery])

  return (
    <>
      <TextField
        placeholder={locale("browse.search.text_placeholder")}
        value={currentQuery}
        onChange={(ev) => setCurrentQuery(ev.target.value)}
      />
      <Stack direction={"row"} sx={{placeItems:"center"}}>
        <Box sx={{ flex: 5 }}>
          <GenrePicker genre={genre as Genre} setGenre={setGenre} />
        </Box>

        <Stack
          direction={"column"}
          sx={{
            textAlign: "center",
            placeItems: "center",
            flex: 1,
          }}
        >
          <Switch
            disabled={!(!isLoading && user) as boolean}
            checked={showRead}
            onChange={(ev) => setShowRead(ev.target.checked)}
          />
          <Typography> {locale("browse.search.show_read")} </Typography>
        </Stack>
      </Stack>
    </>
  )
}
