"use server"

import { UserProfile } from "@auth0/nextjs-auth0/client"
import mongoose from "mongoose"
import { AUTH0_USERS_ENDPOINT, GUEST_USER, GUEST_USER_ID } from "../decs"
import Activity from "../schemata/activity"
import Rating, { RatingType } from "../schemata/rating"
import Story, { StoryType } from "../schemata/story"
import { calcWeightedRating, dbout, json, suggestStories } from "../utils"
import { LogIcon, PERFORM_DATABASE_ACTION, StoryFilter } from "./types"
import { db_like } from "./utils"
import { BrowseTabEnum, Genre, Visibility } from "../defs"

//#region Story getters
export async function db_fetchAllStoriesWithMetrics(staleOnly: boolean = true) {
  const raw_stories = await db_fetchStoriesByTitle("")

  const stories = await Promise.all(
    raw_stories.map(async (story: StoryType) => ({
      ...story,
    }))
  )

  // 12 = 12 hours
  const staleThreshold = new Date(Date.now() - 12 * 60 * 60 * 1000)

  const storiesWithMetrics = await Promise.all(
    stories
        .filter((row: StoryType) => {
            if (!row.metricsLastUpdated)
                return true

            return !staleOnly || row.metricsLastUpdated || new Date(row.metricsLastUpdated) > staleThreshold
        })
        .map(db_getFullStoryMetrics)
  )

  return storiesWithMetrics
}

export async function db_fetchStoriesCount() {
    return await PERFORM_DATABASE_ACTION(() => Story.countDocuments())
}

export async function db_fetchStoryWithFilters(filters: StoryFilter) {
    if (filters.limit === 0) return []
    
    if (filters.tab === BrowseTabEnum.SUGGESTED)
        return suggestStories(
            await PERFORM_DATABASE_ACTION(() => Story.find()),
            filters.userId)

    const stories = await PERFORM_DATABASE_ACTION(() =>
        Story
            .find()
            .limit(filters.limit)
            .sort(filters.tab === BrowseTabEnum.NEW 
                ? { createdAt: "desc" }
                : filters.tab === BrowseTabEnum.TOP
                ? { rating: "desc" }
                : {})
    )

    const filteredStories = await Promise.all(
        stories.map(async (story: StoryType) => {
            if (story.visibility !== Visibility.PUBLIC && story.userId !== filters.userId)
                return null
            
            let isRead = await db_hasReadStory(story._id as string, filters.userId)

            if (!filters.showRead && !isRead)
                return null

            if (filters.genre !== story.genre && filters.genre !== Genre.NONE)
                return null

            return story
        })
    ).then(results => results.filter((s): s is StoryType => s !== null))


    const limitedStories = filteredStories.slice(0, filters.limit)
    dbout(LogIcon.INFO, `Fetched ${filteredStories.length} filtered stories, ${limitedStories.length} were returned with limit of ${filters.limit}`)

    return limitedStories
}

export async function db_getFullStoryMetrics(story: StoryType) {
  return await {
    ...story,
    updatedAt: new Date(story.updatedAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    createdAt: new Date(story.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    rating: await db_getAverageRatingForStoryById(story._id as string),
    views: await db_getStoryViews(story._id as string),
    timestamp: story.createdAt,
  }
}

export async function db_fetchStoriesByTitle(title: string) {
  return PERFORM_DATABASE_ACTION(() => Story.find({ title: db_like(title) }))
}

export async function db_getAverageRatingForStoryById(
  _id: string | mongoose.Types.ObjectId
) {
  const allRatings = await PERFORM_DATABASE_ACTION(() =>
    Rating.find({ storyId: _id })
  )
  if (allRatings.length === 0) return 0

  const averageRating =
    allRatings.reduce((acc: number, r: RatingType) => acc + r.rating, 0) /
    allRatings.length

//   dbout(
//     LogIcon.INFO,
//     `Average rating from ${allRatings.length} reviews was ${averageRating}`
//   )

  return averageRating
}

export async function db_getRating(storyId: string, userId: string) {
  return await PERFORM_DATABASE_ACTION(() =>
    Rating.findOne({ storyId, userId })
  )
}

export async function db_getStoryViews(_id: string | mongoose.Types.ObjectId) {
  const allViews = await PERFORM_DATABASE_ACTION(() =>
    Activity.find({ storyId: _id })
  )
//   dbout(LogIcon.INFO, `View count was ${allViews.length}`)
  return allViews.length
}

/**
 * Finds all stories associates with this user
 * @param userId User to find the stories of
 */
export async function db_fetchStoriesByAuthor(userId: string) {
  const userStories = await PERFORM_DATABASE_ACTION(() =>
    Story.find({ userId })
  )
  dbout(LogIcon.INFO, `Found ${userStories.length} stories by given user`)
  return Promise.all(userStories.map(db_getFullStoryMetrics))
}
//#endregion

//#region Auth0
export async function auth0_fetchUserByName(
  name: string
): Promise<UserProfile> {
  const options = {
    method: "GET",
    params: { q: `nickname:"${name}"`, search_engine: "v3" },
    headers: { authorization: `Bearer ${process.env.AUTH0_API_ACCESS_TOKEN}` },
  }

  const res = await fetch(AUTH0_USERS_ENDPOINT, options)
  const data = await res.json()

  if (!data) dbout(LogIcon.INFO, `No user found with nickname: ${name}`)

  return data
}

export async function auth0_fetchUserById(
  id: string
): Promise<UserProfile | null> {
  if (!id || id === "") return null
  if (id === GUEST_USER_ID) return GUEST_USER

  const options = {
    method: "GET",
    params: { q: `user_id:"${id}"`, search_engine: "v3" },
    headers: { authorization: `Bearer ${process.env.AUTH0_API_ACCESS_TOKEN}` },
  }

  const res = await fetch(AUTH0_USERS_ENDPOINT, options)
  const data = await res.json()

  if (!data) dbout(LogIcon.INFO, `No user found with id...`)

  return data[0]
}

export async function db_fetchTopThreeAuthors()
{
  interface UserScore {
    id: string
    totalViews: number,

    totalRating: number,
    ratingCount: number,
    averageRating: number,

    weightedRating: number,
  }
  interface UserScores {
    [id: string]: UserScore
  }

  const userScores = {} as UserScores

  const allActivity = await PERFORM_DATABASE_ACTION(() => Rating.find())
  const allRatings  = await PERFORM_DATABASE_ACTION(() => Rating.find())

  for ( const activity of allActivity )
  {
    if (!userScores[activity.userId]) {
      userScores[activity.userId] = {
        id: activity.userId,
        totalViews: 0,
        totalRating: 0,
        ratingCount: 0,
        averageRating: 0,
        weightedRating: 0,
      }
    }

    userScores[activity.userId].totalViews += 1;
  }
  for ( const rating of allRatings )
  {
    userScores[rating.userId].totalRating   = (userScores[rating.userId].totalRating || 0) + rating.rating;
    userScores[rating.userId].ratingCount   = (userScores[rating.userId].ratingCount || 0) + 1;
    userScores[rating.userId].averageRating = userScores[rating.userId].totalRating / userScores[rating.userId].ratingCount;
  }

  const topThreeAuthors = Object.values(userScores)
    .map(us => {
      us.weightedRating = calcWeightedRating(
        us.totalViews,
        us.averageRating
      )
      return us
    })
    .sort((a, b) => b.weightedRating - a.weightedRating)
    .slice(0, 3)
    .map(us => us.id)
  
  return [
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[0] ) ),
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[1] ) ),
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[2] ) ),
  ]
}

export async function db_fetchTopThreeReaders()
{
  interface UserScore {
    id: string
    reviewsGiven: number
  }
  interface UserScores {
    [id: string]: UserScore
  }

  const userScores = {} as UserScores
  const allRatings  = await PERFORM_DATABASE_ACTION(() => Rating.find())

  for ( const rating of allRatings )
  {
    if (!userScores[rating.userId]) {
      userScores[rating.userId] = {
        id: rating.userId,
        reviewsGiven: 0,
      }
    }

    userScores[rating.userId].reviewsGiven += 1;
  }

  const topThreeAuthors = Object.values(userScores)
    .sort((a, b) => b.reviewsGiven - a.reviewsGiven)
    .slice(0, 3)
    .map(us => us.id)

  return [
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[0] ) ),
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[1] ) ),
    await PERFORM_DATABASE_ACTION( () => auth0_fetchUserById( topThreeAuthors[2] ) ),
  ]

}
//#endregion

//#region Activity

/**
 * This is used when a user claims a story. If they have rated their own story, we want to remove that rating.
 */
export async function db_removeRatingFromUserOnStory(
  userId: string,
  storyId: string
) {
  await PERFORM_DATABASE_ACTION(() =>
    Rating.findOneAndDelete({ userId, storyId })
  )
}

export async function db_getUserActivity(userId: string) {
  const userActivity = await PERFORM_DATABASE_ACTION(() =>
    Activity.find({ userId })
  )
  return userActivity
}

/**
 * Returns true if the given user has an activity record for the given story
 */
export async function db_hasReadStory(
  storyId: string,
  userId: string | null
): Promise<boolean> {
  if (userId === null)
    return false

  return !!(await PERFORM_DATABASE_ACTION(() =>
    Activity.findOne({ storyId, userId })
  ))
}
//#endregion

//#region Rating
/**
 * Fetch users given rating value for given story
 */
export async function db_getUserRating(userId: string, storyId: string)
{
  const rec = await PERFORM_DATABASE_ACTION(() => Rating.findOne({userId, storyId}))
  return rec?.rating
}
//#endregion