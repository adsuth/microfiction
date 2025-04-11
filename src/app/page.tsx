"use server"

import BrowseStack from "@/components/BrowseStack"
import { Divider, Stack } from "@mui/material"
import SearchBar from "@/components/Search"
import StoryCardModal from "@/components/StoryCardModal"
import { db_fetchAllStories } from "@/lib/db/get"

export default async function Home() 
{
  const stories = await db_fetchAllStories()

  return (
    <>
      <StoryCardModal />

      <Stack direction={"column"} gap={4} paddingY={4} paddingX={8}>
        <SearchBar />
        <Divider />
        <BrowseStack {...stories as any} />
      </Stack>
    </>
  )
}
