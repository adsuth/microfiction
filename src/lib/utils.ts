/**
 * Declarations for global utility functions
 */
import { env } from "process"
import { LogIcon } from "./db/types"
import {
  BrowseTabEnum,
  Genre,
  genreEmojis,
  genreIcons,
  Visibility,
} from "./defs"

import { UserProfile } from "@auth0/nextjs-auth0/client"
import en_locale from "../locale/en.json"
import {
  db_getUserRating,
  db_hasReadStory
} from "./db/get"
import { StoryType } from "./schemata/story"
import words from "../locale/words.json"


export function getGenreIconClass(genre: string | Genre) {
  if (typeof genre === "string") return genreIcons[genre.toUpperCase()]
  if (typeof genre === "number") return genreIcons[Genre[genre]]
}

export function getGenreEmoji(genre: string | number) {
  if (typeof genre === "string") return genreEmojis[genre.toUpperCase()]
  if (typeof genre === "number") return genreEmojis[Genre[genre]]
}

/**
 * Retrieve the a normalized name for the @link {Genre} for the associated number.\
 * For instance, 0 -> Comedy
 * @param num Number value of genre from @link {Genre}. 0 = COMEDY for example.
 */
export function getGenreNorm(num: number) {
  const genre = Genre[num] as string
  return locale(`enum.genre.${genre.toLowerCase()}`, "misc.none")
}

export function genreStringToNumber(genreString: string) {
  if (!genreString) return 0
  const genreNum = Genre[genreString.toUpperCase() as keyof typeof Genre]
  return genreNum
}

export function getGenreChipLabel(genre: number) {
  return `${getGenreEmoji(genre)} ${getGenreNorm(genre)}`
}

export function normalizeGenres(list: number[]) {
  return list.map(getGenreNorm)
}

export function getAllGenres(includeNone = false) {
  const validKey = (key: number) => (includeNone ? true : key)
  return normalizeGenres(
    Object.keys(Genre)
      .map((key) => Number(key))
      .filter((key) => validKey(key) && !isNaN(key))
  )
}

export function getAllRawGenres(includeNone = false) {
  const validKey = (key: number) => (includeNone ? true : key)
  return Object.keys(Genre)
    .map((key) => Number(key))
    .filter((key) => validKey(key) && !isNaN(key))
}

export function json(object: any) {
  return JSON.parse(JSON.stringify(object))
}

export function isGenreInList(genre: string, allGenres: string[]) {
  return allGenres.includes(genre)
}

/**
 * Database debug logging. Same params as `console.log`
 * Pass a icon from @type {LogIcon} as the first arg to change the prefix
 */
export function dbout(...args: any[]) {
  if (env.BUILD === "PROD") return
  if (!Object.values(LogIcon).includes(args[0]))
    args = [LogIcon.DEFAULT, ...args]
  console.log(...args)
}

/**
 * Convert the string to its localized value.
 * @param path Path to the localized value, dot-separated.
 * @param fallback The fallback should that value not be found. If empty, will just display the path instead
 */
export function locale(path: string, fallback: string = ""): string {
  // todo :: get the relevant locale somehow

  const steps = path.split(".")
  let current: any = en_locale

  try {
    for (const step of steps) {
      current = current[step]
    }
  } catch (err) {
    console.error(
      `Locale error, ${path} was not found in locale file ../locale/en.json.\nCurrent was: ${current}`
    )
    return fallback === "" ? path : locale(fallback)
  }

  return current
}

/**
 * Checks a story card element and returns a missing placeholder based on user locale if needed. Otherwise, returns the original value.
 * @param element The name of the element to check, this corresponds with locale file (eg, blurb, title, etc.)
 * @param value The value to be tested. If falsy, the missing locale text will be displayed instead.
 */
export function verifyStoryCardElement(element: string, value: any) {
  if (!value) return locale(`stories.card.missing.${element}`)

  return value
}

/**
 * Compare two date strings by converting to timestamps and subtracting.
 * This is for a sort function.
 * This will sort for most recent first
 */
export function compareDate(d1: any, d2: any) {
  return new Date(d2).getTime() - new Date(d1).getTime()
}

export function calcStoryWeightedRating(story: StoryType) {
  return calcWeightedRating(story.rating ?? 0, story.views ?? 0)
}
export function calcWeightedRating(rating: number, views: number) {
  return rating * 0.4 + views * 0.6
}

/**
 * Compares two stories based on a weighted rating
 */
export function compareStoryWeightedRating(s1: StoryType, s2: StoryType) {
  const s1WeightedRating = calcStoryWeightedRating(s1)
  const s2WeightedRating = calcStoryWeightedRating(s2)

  return s2WeightedRating - s1WeightedRating
}

/**
 * If provided boolean is true, return PRIVATE else PUBLIC
 * @param vis
 * @returns
 */
export function inferVisibility(vis: boolean) {
  return vis ? Visibility.PUBLIC : Visibility.PRIVATE
}

export function decodeBase64Image(story: StoryType) {
  const { thumbnail, genre } = story

  if (!thumbnail)
    return `https://placehold.co/400`
  const buffer = Buffer.from(thumbnail, "base64")
  return `data:image/png;base64,${buffer.toString("base64")}`
}

/**
 * Determine if the user can view the story.
 * PUBLIC -> viewable by all
 * PRIVATE -> viewable only by logged in users
 */
export function canViewStory(visibility: Visibility, loggedIn: boolean) {
  let canView = false

  switch (visibility) {
    case Visibility.PUBLIC:
      canView = true
      break
    case Visibility.PRIVATE:
      if (loggedIn) canView = true
      break
    case Visibility.DRAFT:
      break
  }

  return canView
}

/**
 * Returns the elapsed time in ms since start
 */
export function timeDifference(start: number, end: number): number {
  if (!start || !end) return -1
  return end - start
}

export function timeInSeconds(ms: number) {
  return Math.ceil(ms / 1_000)
}

export async function applyStoryFilters(
  stories: StoryType[],
  user: UserProfile,
  query: string,
  genre: Genre,
  showRead: boolean
) {
  let filteredStories = []
  for (let story of stories) {
    const storyFilterChecks =
      canViewStory(story.visibility, !!user) &&
      story.title.toLowerCase().includes(query) &&
      (genre === story.genre ||
        genre === Genre.NONE ||
        story.genre === Genre.NONE) &&
      (showRead ||
        (!showRead &&
          !(await db_hasReadStory(story._id as string, user?.sub as string))))
    if (storyFilterChecks) filteredStories.push(story)
  }

  return filteredStories
}

/**
 * Suggests stories to user based on their most rated genre. This will then suggest some unread stories of their most rated genre.
 */
export async function suggestStories(allStories: StoryType[], userId: string) {
  if (!userId) return []
  interface GenreRatings {
    [genre: number]: number
  }
  const userRatingsAcrossGenres = {} as GenreRatings
  const unviewedStories = []
  const suggestions = []

  // go through each story and get counts of users ratings by genre
  const storiesByTop = allStories.sort(
    (a, b) => (b.rating as number) - (a.rating as number)
  )

  for (const story of storiesByTop) {
    if (story.genre === Genre.NONE) continue

    const storyId = story._id as string
    const userRating = await db_getUserRating(userId, storyId)

    // add to pool of possible suggestions
    if (!userRating && userRating !== 0) {
      if (story.userId !== userId) unviewedStories.push(story)
      continue
    }

    // add new count
    if (!userRatingsAcrossGenres[story.genre])
      userRatingsAcrossGenres[story.genre] = 0

    userRatingsAcrossGenres[story.genre] += userRating
  }

  // get the favored genre
  let favoredGenre = Genre.NONE
  let favoredRatingTotal = 0
  for (const [genre, totalRating] of Object.entries(userRatingsAcrossGenres)) {
    if (!favoredGenre || totalRating > favoredRatingTotal) {
      favoredGenre = Number(genre)
      favoredRatingTotal += Number(totalRating)
    }
  }

  if (favoredGenre === Genre.NONE) return []

  // get the top 5 stories for that genre
  for (const story of unviewedStories) {
    if (suggestions.length >= 5) break
    if (story.genre === favoredGenre) suggestions.push(story)
  }

  return suggestions
}

export async function sortStoryForTab(
  stories: StoryType[],
  userId: string,
  tab: BrowseTabEnum
) {
  switch (tab) {
    case BrowseTabEnum.NEW:
      return [...stories].sort((a, b) => compareDate(a.timestamp, b.timestamp))
    case BrowseTabEnum.TOP:
      return [...stories].sort(
        (a, b) => (b.rating as number) - (a.rating as number)
      )
    case BrowseTabEnum.SUGGESTED:
      return suggestStories([...stories], userId)
  }
}

export function capitalize(string: string)
{
  return string[0].toUpperCase() + string.slice(1)
}

export function randomStoryTitle()
{
  const randomAdjective = capitalize( randomChoiceFrom( words.adjectives ) )
  const randomNoun      = capitalize( randomChoiceFrom( words.nouns ) )
  return `${randomAdjective} ${randomNoun}`;
} 

export function randomChoiceFrom(array: any[])
{
  return array[Math.floor(Math.random() * array.length)]
}