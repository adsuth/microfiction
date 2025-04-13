"use client"

import StoryEditDialog from "@/components/dialog/StoryEditDialog"
import { HudMessageType } from "@/components/HudMessage"
import PageLoading from "@/components/skeletons/PageLoading"
import StoryCard from "@/components/StoryCard"
import { selectedStoryAtom } from "@/lib/atoms"
import { db_fetchStoriesByAuthor } from "@/lib/db/get"
import { StoryType } from "@/lib/schemata/story"
import { locale } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0/client"
import AddIcon from "@mui/icons-material/Add"
import { Fab, Link, Stack, Tooltip, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryType[] | null>(null)
  const [hudMessage, setHudMessage] = useState<HudMessageType>()
  const { user, isLoading } = useUser()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStory] = useAtom(selectedStoryAtom)

  // make sure the user is signed in, then get all their stories.
  useEffect(() => {
    if (!user) return
    const fetchUserStories = async () => {
      setStories(await db_fetchStoriesByAuthor(user.sub as string))
    }
    fetchUserStories()
  }, [user, selectedStory])

  useEffect(() => {
    setModalOpen(!!selectedStory)
  }, [selectedStory])

  if (isLoading || (user && !stories)) return <PageLoading />

  // user not logged in, redirect
  if (!user) {
    window.location.href = "/api/auth/login"
    return <PageLoading />
  }

  return (
    <>
      <StoryEditDialog
        story={selectedStory as StoryType}
        open={modalOpen}
        setOpen={setModalOpen}
      />

      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        {getStoriesPageContent(stories as StoryType[])}
      </Stack>

      <Link
        href="/create"
        sx={{ m: 8, bottom: 0, right: 0, position: "absolute" }}
      >
        <Tooltip title={locale("stories.tooltip.new")}>
          <Fab size="large" color="primary">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
    </>
  )
}

function getStoriesPageContent(stories: StoryType[]) {
  if (stories.length > 0)
    return (
      <>
        <Stack
          direction={"column"}
          gap={2}
          sx={{ width: "50%", m: "auto", p: 8 }}
        >
          {makeStoryCards(stories)}
        </Stack>
      </>
    )

  return (
    <>
      <Stack direction={"column"} gap={2} sx={{ textAlign: "center" }}>
        <Typography variant="h4">
          {locale("stories.no_stories_header")}
        </Typography>
        <Typography variant="body1">
          {locale("stories.no_stories_body")}
        </Typography>
      </Stack>
    </>
  )
}

function makeStoryCards(stories: StoryType[]) {
  return stories.map((story: StoryType) => (
    <StoryCard key={story._id as string} {...story} />
  ))
}
