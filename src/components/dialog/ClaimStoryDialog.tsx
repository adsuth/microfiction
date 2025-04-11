"use client"

import { locale } from "@/lib/utils"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, TextField, IconButton,
  Stack,
} from "@mui/material"
import { useState } from "react"
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import { InputAdornment } from '@mui/material'
import { hudMessageAtom } from "@/lib/atoms"
import { useAtom } from "jotai"
import { HudMessageTypeEnum } from "../HudMessage"
import { db_claimStory } from "@/lib/db/post"
import { UserProfile } from "@auth0/nextjs-auth0/client"
import { StoryType } from "@/lib/schemata/story"

interface DialogProps {
  user: UserProfile,
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ClaimStoryDialog(props: DialogProps)
{
  const { open, setOpen, user } = props
  const [code, setCode] = useState<string>("")
  const [, setHudMessage] = useAtom(hudMessageAtom)

  async function tryClaimStory()
  {
    if (!code)
    {
      setHudMessage({message: "Please enter a valid code", type: HudMessageTypeEnum.BAD, time: 3000})
      return
    }
    
    const [response, message] = await db_claimStory(user?.sub as string, code)
    
    if (response === "failure")
    {
      setHudMessage({message, type: HudMessageTypeEnum.BAD})
    }
    else
    {
      setHudMessage({message, type: HudMessageTypeEnum.GOOD})
      setOpen(false)
    }
  
  }

  async function pasteClipboardToCode()
  {
    try {
      const text = await navigator.clipboard.readText()
      setCode(text)
    }
    catch(err) {}
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle> {locale("dialog.claim_story.title")} </DialogTitle>
      <DialogContent>
        <DialogContentText> {locale("dialog.claim_story.content")} </DialogContentText>
        <Stack direction="row">
          <TextField
            sx={{m: "auto"}}
            label={locale("dialog.claim_story.code_label")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={pasteClipboardToCode}>
                    <ContentPasteIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => props.setOpen(false)} color="primary">
          {locale("misc.cancel")}
        </Button>
        <Button
          onClick={tryClaimStory}
          color="primary"
          autoFocus
        >
          {locale("misc.claim")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
