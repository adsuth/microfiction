"use client"

import { selectedStoryAtom } from "@/lib/atoms"
import { auth0_fetchUserById } from "@/lib/db/get"
import { db_addActivity } from "@/lib/db/post"
import { locale } from "@/lib/utils"
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client"
import CloseIcon from "@mui/icons-material/Close"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Modal,
  Rating,
  Stack,
  Typography,
  Button,
} from "@mui/material"
import { grey } from "@mui/material/colors"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import StoryRating from "./StoryRating"

export default function StoryCardModal() {
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState<UserProfile | null>(null)
  const { user, isLoading } = useUser()

  const [story] = useAtom(selectedStoryAtom)

  useEffect(() => {
    if (!story) return
    if (isLoading) return

    setOpen(true)

    // this should be in a lookup!
    auth0_fetchUserById(story.userId).then(
      (fetchedAuthor: UserProfile | null) => {
        db_addActivity(story._id as string, user?.sub as string)
        setAuthor(fetchedAuthor)
      },
    )
  }, [story, isLoading])

  function handleSetOpen(newValue: boolean) {
    setOpen(newValue)
  }

  if (!author || !story) return <></>

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        disableAutoFocus
      >
        <Card
          sx={{
            width: 400,
            borderRadius: 3,
            boxShadow: 5,
            p: 2,
            bgcolor: "white",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => handleSetOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Card Header */}
          <CardHeader
            sx={{ paddingBottom: 0 }}
            avatar={
              <Avatar
                sx={{ bgcolor: grey[500] }}
                src={author?.picture || undefined}
              />
            }
            title={<Typography variant="h6">{story.title}</Typography>}
            subheader={
              <Typography variant="body2" color="text.secondary">
                {`${locale("misc.written_by")} ${author?.nickname}`}
              </Typography>
            }
          />

          {/* Card Content */}
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Rating sx={{ m: "auto" }} value={story.rating} readOnly />
            </Box>
            <Typography variant="body1" gutterBottom>
              {story.content}
            </Typography>

            {/* Metadata */}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">{`${locale(
                "misc.created",
              )} ${new Date(story.createdAt).toLocaleString()}`}</Typography>
              <Typography variant="body2" color="text.secondary">{`${locale(
                "misc.updated",
              )} ${new Date(story.updatedAt).toLocaleString()}`}</Typography>
            </Box>

            {/* User Rating */}
            <StoryRating
              userId={user?.sub as string}
              storyId={story._id as string}
              authorId={story.userId}
            />
          </CardContent>
        </Card>
      </Modal>
    </>
  )
}
