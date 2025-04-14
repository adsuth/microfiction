"use client"

import StoryEditDialog from "@/components/dialog/StoryEditDialog"
import { HudMessageType } from "@/components/HudMessage"
import PageLoading from "@/components/skeletons/PageLoading"
import StoryCard from "@/components/StoryCard"
import { TabPanel } from "@/components/TabPanel"
import { selectedStoryAtom } from "@/lib/atoms"
import { db_fetchStoriesByAuthor } from "@/lib/db/get"
import { UserStoriesTabEnum } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import { locale } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0/client"
import AddIcon from "@mui/icons-material/Add"
import { Fab, Link, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { Key, useEffect, useState } from "react"

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryType[] | null>(null)
  const [hudMessage, setHudMessage] = useState<HudMessageType>()
  const { user, isLoading } = useUser()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStory] = useAtom(selectedStoryAtom)
  const [tab, setTab] = useState<UserStoriesTabEnum>(UserStoriesTabEnum.STORIES)

  const handleTabChange = (ev: React.SyntheticEvent, val: number) => {
    setTab(val)
  }

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
    <Stack direction={"column"} gap={4} paddingY={4} paddingX={8}>
      <StoryEditDialog
        story={selectedStory as StoryType}
        open={modalOpen}
        setOpen={setModalOpen}
      />

      <Stack m={"auto"}>
        <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{ m: "auto", w: "100%" }}
          >
          <Tab label={UserStoriesTabEnum[0]} />
        </Tabs>

      <TabPanel index={UserStoriesTabEnum.STORIES} value={tab}>
        {getStoriesPageContent(stories as StoryType[])}
      </TabPanel>
      </Stack>

      <Link
        href="/create"
        sx={{
          position: "fixed",
          bottom: "5vh",
          right: "5vw",
        }}
      >
        <Tooltip title={locale("stories.tooltip.new")}>
          <Fab size="large" color="primary">
            <AddIcon />
          </Fab>
        </Tooltip>
      </Link>
    </Stack>
  )
}

function getStoriesPageContent(stories: StoryType[]) {
  if (stories.length > 0)
    return (
      <>
        {stories.map((story) => (
          <StoryCard key={story._id as Key} {...story} />
        ))}
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