"use client"

import { hudMessageAtom } from "@/lib/atoms"
import { db_updateStoryAttribute } from "@/lib/db/post"
import { Visibility } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { inferVisibility, locale } from "@/lib/utils"
import {
  Dialog,
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
import { useAtom } from "jotai"
import { SetStateAction, useState } from "react"
import { HudMessageTypeEnum } from "../HudMessage"
import StoryDeleteDialog from "./StoryDeleteDialog"

interface DialogProps {
  story: StoryType
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StoryEditDialog(props: DialogProps) {
  const { story, open, setOpen } = props
  const [code, setCode] = useState<string>("")
  const [, setHudMessage] = useAtom(hudMessageAtom)

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

  function updateVisibility(newValue: Visibility) 
  {
    try {
      story.visibility = newValue
      db_updateStoryAttribute(story._id as string, "visibility", newValue)
    }
    catch(err: any) {
      setHudMessage({message: err.message, type: HudMessageTypeEnum.BAD})
    }
  }

  if (!story) return <></>

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <StoryDeleteDialog 
        open={deleteOpen} 
        setOpen={setDeleteOpen} 
      />
      <DialogTitle>
        {locale("dialog.edit_story.title")} "{story.title}"{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {locale("dialog.edit_story.content")}
        </DialogContentText>
        <Stack>
          <Typography variant="subtitle1">
            {locale("dialog.edit_story.visibility")}
          </Typography>
          <Tooltip
            placement="bottom-start"
            title={locale(
              `create.tooltip.visibility_${
                story.visibility === Visibility.PUBLIC ? "on" : "off"
              }`
            )}
          >
            <FormControlLabel
              labelPlacement="bottom"
              label={locale(
                `create.labels.visibility_${
                  story.visibility === Visibility.PUBLIC ? "on" : "off"
                }`
              )}
              control={
                <Switch
                  value={story.visibility === Visibility.PUBLIC}
                  checked={story.visibility === Visibility.PUBLIC}
                  onChange={(ev) =>
                    updateVisibility(inferVisibility(ev.target.checked))
                  }
                />
              }
            />
          </Tooltip>
          
          <Divider />
          
          <Stack direction={"column"}>
            <Typography variant="subtitle1">
              {locale("dialog.edit_story.delete_story")}
            </Typography>
            <Button
              variant="text"
              color="error"
              endIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
            >
              {locale("misc.delete")}
            </Button>
            
          </Stack>


        </Stack>
      </DialogContent>
    </Dialog>
  )
}
