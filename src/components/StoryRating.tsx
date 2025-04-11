"use client"

import { hudMessageAtom } from "@/lib/atoms"
import { db_giveRating } from "@/lib/db/post"
import { CircularProgress, Rating, Stack, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { HudMessageTypeEnum } from "./HudMessage"
import { GUEST_USER_ID } from "@/lib/decs"
import { locale } from "@/lib/utils"
import { db_getRating } from "@/lib/db/get"

interface StoryRatingProps {
  userId: string
  storyId: string
  authorId: string
}

export default function StoryRating(props: StoryRatingProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hudMessage, setHudMessage] = useAtom(hudMessageAtom)

  const { authorId, userId, storyId } = props

  useEffect(() => {
    if (!rating) return
    
    db_giveRating(storyId, userId, rating)
      .then(changed => {
        if (changed)
          setHudMessage({
            message: "Thank you for your rating!",
            type: HudMessageTypeEnum.GOOD,
          })
      })
      .catch((err) =>
        setHudMessage({ message: err.message, type: HudMessageTypeEnum.BAD })
      )
  }, [rating])

  useEffect(() => {
    db_getRating(storyId, userId)
      .then( data => setRating(data?.rating ?? 0) )
  }, [])

  // authors cannot rate their own stories. Guests cannot rate.
  if (!userId || authorId === userId || userId === GUEST_USER_ID) return <></>

  // todo :: handle removing ratings from claimed stories

  return (
    <>
      <Stack direction="column" mt={1} sx={{ placeItems: "center" }}>
        {rating === null ? (
          <CircularProgress />
        ) : (
          <>
        <Rating
          name="story-rating"
          value={rating ?? 0}
          precision={1}
          sx={{ mb: 1 }}
          onChange={(event, newValue) => setRating(newValue || 0)}
        />
        <Typography variant="body2">{locale("misc.your_rating")}</Typography>
          </>
        )}
      </Stack>
    </>
  )
}
