"use server"

import BrowseStack from "@/components/BrowseStack"
import { Divider, Stack } from "@mui/material"
import SearchBar from "@/components/Search"
import StoryCardModal from "@/components/StoryCardModal"
import { db_fetchAllStories } from "@/lib/db/get"

export default async function Home() {
  const stories = await db_fetchAllStories()

  return (
    <>
      <StoryCardModal />

      <Stack
        direction={"column"}
        gap={{ xs: 2, sm: 3, md: 4 }}
        paddingY={{ xs: 2, sm: 3, md: 4 }}
        paddingX={{ xs: 2, sm: 4, md: 8 }}
      >
        <SearchBar />
        <Divider />
        <BrowseStack {...(stories as any)} />
      </Stack>
    </>
  )
}
