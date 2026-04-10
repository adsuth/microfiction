"use client"

import {
  Container,
  Fab,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material"
import { Key, useEffect, useState } from "react"

import { genreAtom, queryAtom, showReadAtom } from "@/lib/atoms"
import { db_fetchStoriesCount, db_fetchStoryWithFilters } from "@/lib/db/get"
import { BrowseTabEnum } from "@/lib/defs"
import { StoryType } from "@/lib/schemata/story"
import { locale } from "@/lib/utils"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useAtom } from "jotai"
import PageLoading from "./skeletons/PageLoading"
import StoryCard from "./StoryCard"
import { TabPanel } from "./TabPanel"
import InfiniteScroll from "react-infinite-scroll-component"
import { StoryFilter } from "@/lib/db/types"
import { LOAD_INCREMENT } from "@/lib/decs"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

export default function BrowseStack() {
  const [stories, setStories] = useState<StoryType[] | null>(null)

  const [tab, setTab] = useState<BrowseTabEnum>(0)

  const [query] = useAtom<string>(queryAtom)
  const [genre] = useAtom(genreAtom)
  const [showRead] = useAtom(showReadAtom)

  const [limit, setLimit] = useState(LOAD_INCREMENT)
  const [totalCount, setTotalCount] = useState<number | null>(null)

  const { user, isLoading } = useUser()

  const handleTabChange = (_ev: React.SyntheticEvent, val: number) => {
    if (stories === null) return // prevents switching before filters finish
    setTab(val)
  }

  // #region UseEffects
  useEffect(() => {
    db_fetchStoriesCount().then((count) => setTotalCount(count))
  }, [])

  useEffect(() => {
    if (limit === LOAD_INCREMENT) setLimit(LOAD_INCREMENT + 1)
    else setLimit(LOAD_INCREMENT)
  }, [tab])

  useEffect(() => {
    let filters: StoryFilter = {
      tab,
      limit: limit,
      userId: user?.sub as string,
      title: query,
      genre: genre,
      showRead: showRead,
    }

    db_fetchStoryWithFilters(filters).then((stories) => {
      setStories(stories as StoryType[])
    })
  }, [showRead, query, genre, user, limit])
  // #endregion

  function generateStoryCards() {
    if (stories === null || stories.length === 0) return []

    return stories.map((story) => (
      <StoryCard key={story._id as Key} {...story} />
    ))
  }

  if (isLoading) return <PageLoading />

  return (
    <>
      <Stack m={"auto"}>
        <Tooltip title={locale("browse.tooltip.to_top")}>
          <Fab
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            size="large"
            color="primary"
            sx={{
              position: "fixed",
              bottom: "5vh",
              right: "5vw",
              display: limit > LOAD_INCREMENT ? "flex" : "none",
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
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
          <InfiniteScroll
            next={() => setLimit(limit + LOAD_INCREMENT)}
            hasMore={totalCount !== null && totalCount > limit}
            dataLength={stories?.length ?? 0}
            endMessage={
              <Typography variant="body1" align="center">
                {locale("browse.no_results")}
              </Typography>
            }
            loader={<></>}
          >
            <Stack p={1}>{generateStoryCards()}</Stack>
          </InfiniteScroll>
        </TabPanel>

        <TabPanel index={BrowseTabEnum.TOP} value={tab}>
          <InfiniteScroll
            next={() => setLimit(limit + LOAD_INCREMENT)}
            hasMore={totalCount !== null && totalCount > limit}
            dataLength={stories?.length ?? 0}
            endMessage={
              <Typography variant="body1" align="center">
                {locale("browse.no_results")}
              </Typography>
            }
            loader={<></>}
          >
            <Stack p={1}>{generateStoryCards()}</Stack>
          </InfiniteScroll>
        </TabPanel>

        <TabPanel index={BrowseTabEnum.SUGGESTED} value={tab}>
          <InfiniteScroll
            next={() => setLimit(limit + LOAD_INCREMENT)}
            hasMore={totalCount !== null && totalCount > limit}
            dataLength={stories?.length ?? 0}
            endMessage={
              <Typography variant="body1" align="center">
                {locale("browse.no_suggestions")}
              </Typography>
            }
            loader={<></>}
          >
            <Stack p={1}>{generateStoryCards()}</Stack>
          </InfiniteScroll>
        </TabPanel>
      </Stack>
    </>
  )
}
