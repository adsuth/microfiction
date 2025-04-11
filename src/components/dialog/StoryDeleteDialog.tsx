"use client"

import { hudMessageAtom, selectedStoryAtom } from "@/lib/atoms"
import { db_deleteStoryById, db_updateStoryAttribute } from "@/lib/db/post"
import { Visibility } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import { inferVisibility, locale } from "@/lib/utils"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
  Typography, Button,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useAtom } from "jotai"
import { useState } from "react"
import { HudMessageTypeEnum } from "../HudMessage"

interface DialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StoryDeleteDialog(props: DialogProps) {
  const { open, setOpen } = props
  const [, setHudMessage] = useAtom(hudMessageAtom)
  const [selectedStory, setSelectedStory] = useAtom(selectedStoryAtom)

  async function deleteStory()
  {
    try 
    {
      await db_deleteStoryById(selectedStory?._id as string)
      setHudMessage({message: locale("dialog.delete_story.success"), type: HudMessageTypeEnum.GOOD})
      setOpen(false)
      setSelectedStory(undefined)
    } 
    catch (err: any) 
    {
      setHudMessage({message: err.message, type: HudMessageTypeEnum.BAD})
    }
  }
  
  if (!selectedStory) return <></>

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>
        {locale("dialog.delete_story.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {locale("dialog.delete_story.content")}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{m: "auto"}}>
        <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>
          {locale("misc.cancel")}
        </Button>
        <Button variant="contained" color="error" onClick={deleteStory}>
          {locale("misc.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
