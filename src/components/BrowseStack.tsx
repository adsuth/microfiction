"use client"

import { Box, Stack, Tab, Tabs, Typography } from "@mui/material"
import { Key, useEffect, useState } from "react"

import {
  genreAtom,
  queryAtom,
  showReadAtom
} from "@/lib/atoms"
import { db_fetchAllStories } from "@/lib/db/get"
import { BrowseTabEnum } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import {
  applyStoryFilters,
  locale,
  sortStoryForTab
} from "@/lib/utils"
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client"
import { useAtom } from "jotai"
import PageLoading from "./skeletons/PageLoading"
import StoryCardSkeleton from "./skeletons/StoryCardSkeleton"
import StoryCard from "./StoryCard"

//#region Tab Panel
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            paddingTop: 2,
            w: "100%",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}
//#endregion

export default function BrowseStack() {
  const [allStories, setAllStories] = useState<StoryType[]>([])
  const [filteredStories, setFilteredStories] = useState<StoryType[] | null>(
    null
  )

  const [tab, setTab] = useState<BrowseTabEnum>(0)

  const [query] = useAtom<string>(queryAtom)
  const [genre] = useAtom(genreAtom)
  const [showRead] = useAtom(showReadAtom)

  const { user, isLoading } = useUser()

  const handleTabChange = (ev: React.SyntheticEvent, val: number) => {
    if (filteredStories === null) return // prevents switching before filters finish
    setTab(val)
  }

  // #region UseEffects
  useEffect(() => {
    db_fetchAllStories().then((stories) => setAllStories(stories as any))
  }, [])

  useEffect(() => {
    if (allStories.length === 0) return
    setFilteredStories(null)

    applyStoryFilters(allStories, user as UserProfile, query, genre, showRead)
      .then((stories) => sortStoryForTab(stories, user?.sub as string, tab))
      .then((stories) => setFilteredStories(stories))
  }, [allStories, query, genre, showRead, tab])
  // #endregion

  function generateStoryCards() {
    if (filteredStories === null)
      return (
        <>
          <StoryCardSkeleton />
          <StoryCardSkeleton />
          <StoryCardSkeleton />
        </>
      )

    if (filteredStories.length > 0)
      return filteredStories.map((story) => (
        <StoryCard key={story._id as Key} {...story} />
      ))

    if (tab === BrowseTabEnum.SUGGESTED)
      if (!user)
        return (
          <Typography variant="body1">
            {locale("browse.no_suggestions_for_guest")}
          </Typography>
        )
      else
        return (
          <Typography variant="body1">
            {locale("browse.no_suggestions")}
          </Typography>
        )

    return (
      <Typography variant="body1">{locale("browse.no_results")}</Typography>
    )
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <Stack m={"auto"}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ m: "auto", w: "100%" }}
        >
          <Tab label={BrowseTabEnum[0]} />
          <Tab label={BrowseTabEnum[1]} />
          <Tab label={BrowseTabEnum[2]} />
        </Tabs>

        <TabPanel index={BrowseTabEnum.NEW} value={tab}>
          {generateStoryCards()}
        </TabPanel>

        <TabPanel index={BrowseTabEnum.TOP} value={tab}>
          {generateStoryCards()}
        </TabPanel>

        <TabPanel index={BrowseTabEnum.SUGGESTED} value={tab}>
          {generateStoryCards()}
        </TabPanel>
      </Stack>
    </>
  )
}
