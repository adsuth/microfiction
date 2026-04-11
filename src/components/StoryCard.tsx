"use client"

import { selectedStoryAtom } from "@/lib/atoms"
import { Genre } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import { getGenreChipLabel, verifyStoryCardElement } from "@/lib/utils"
import { Edit, Upgrade, Tag, Visibility } from "@mui/icons-material"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Stack,
  Typography,
} from "@mui/material"
import { useAtom } from "jotai"
import StoryCardSkeleton from "./skeletons/StoryCardSkeleton"

export default function StoryCard(props: StoryType) {
  const { _id, title, createdAt, updatedAt, blurb, genre, rating, views } =
    props
  const [, setSelectedStory] = useAtom(selectedStoryAtom)

  if (!_id) return <StoryCardSkeleton />

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "auto",
        borderRadius: 3,
        boxShadow: 3,
        mt: 2,
        mx: 2,

        cursor: "pointer",
      }}
      onClick={() => {
        setSelectedStory({ ...props })
      }}
    >
      {/* Image Section */}
      <Stack direction="row">
        <CardMedia
          component="img"
          image={
            `https://picsum.photos/300?seed=${_id}` /* At some point, we planned to have thumbnails for images */
          }
          sx={{
            flex: 2,
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          alt="Story Cover"
        />

        {/* Content Section */}
        <CardContent
          sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 1 }}
        >
          <Typography variant="h5" fontWeight="bold" color="text.secondary">
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {verifyStoryCardElement("blurb", blurb)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              placeItems: "center",
            }}
          >
            {genre === Genre.NONE ? (
              <></>
            ) : (
              <Chip label={getGenreChipLabel(genre)} />
            )}
          </Box>

          <Rating
            name="story-rating"
            value={rating}
            precision={0.5}
            readOnly
            sx={{ mb: 1 }}
          />

          {/* Metadata Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Visibility fontSize="small" />
              <Typography variant="body2">{views}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Edit fontSize="small" />
              <Typography variant="body2">
                {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Upgrade fontSize="small" />
              <Typography variant="body2">
                {new Date(updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Stack>
    </Card>
  )
}
