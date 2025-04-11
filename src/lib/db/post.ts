"use server"

import { GUEST_USER_ID } from "../decs"
import { PublishedStoryType } from "../defs"
import Activity from "../schemata/activity"
import Rating from "../schemata/rating"
import Story, { StoryType } from "../schemata/story"
import { dbout } from "../utils"
import dbConnect from "./connect"
import { auth0_fetchUserById, db_removeRatingFromUserOnStory } from "./get"
import { LogIcon, PERFORM_DATABASE_ACTION } from "./types"

//#region Activity
export async function db_addActivity(storyId: string, userId: string) {
  if (!userId || userId === GUEST_USER_ID) return
  await dbConnect()

  const activityAlreadyExists = await Activity.findOne({ storyId, userId })
  if (!activityAlreadyExists) {
    await new Activity({
      storyId,
      userId,
    }).save()
  }
}
//#endregion

//#region Story
export async function db_createNewStory(
  story: StoryType
): Promise<PublishedStoryType> {
  await dbConnect()

  if (story.userId !== GUEST_USER_ID) {
    const user = await auth0_fetchUserById(story.userId)
    if (!user)
      throw new Error(`Cannot create a story for a user that does not exist!`)
  }

  const doc = await new Story({ ...story }).save()
  dbout(`New story "${doc.title}" was added to the database!`)

  return { storyId: doc._id as string, userId: doc.userId }
}

export async function db_claimStory(
  userId: string,
  code: string
): Promise<[string, string]> {
  let message = ""
  if (userId === GUEST_USER_ID) {
    message = "Cannot claim story as a guest."
    dbout(message, LogIcon.ERROR)
    return ["failure", message]
  }

  if (!code.match(/^[0-9a-fA-F]{24}$/)) {
    // Check if userId is a valid ObjectId
    message = "Given code is invalid."
    dbout(message, LogIcon.ERROR)
    return ["failure", message]
  }

  await dbConnect()

  const story = await Story.findOne({ _id: code })
  if (!story) {
    message = "No story found with the provided code."
    dbout(message, LogIcon.ERROR)
    return ["failure", message]
  }

  // update the owner
  story.userId = userId
  await story.save()

  message = `You have claimed "${story.title}"!`
  dbout(message)

  db_removeRatingFromUserOnStory(userId, code)

  return ["success", message]
}

export async function db_updateStoryAttribute(
  storyId: string,
  attribute: keyof StoryType,
  newValue: any
) {
  await dbConnect()
  const story = await Story.findById(storyId)

  if (!story) {
    throw new Error("Story not found, cannot update attribute.")
  }
  if (story[attribute] === undefined) {
    throw new Error("Attribute not found, consult the schema.")
  }

  ;(story[attribute] as typeof newValue) = newValue
  await story.save()
}

export async function db_deleteStoryById(storyId: string) {
  await PERFORM_DATABASE_ACTION(() => Activity.deleteMany({ storyId }))
  await PERFORM_DATABASE_ACTION(() => Rating.deleteMany({ storyId }))
  await PERFORM_DATABASE_ACTION(() => Story.findByIdAndDelete(storyId))
}
//#endregion

//#region Ratings
export async function db_giveRating(
  storyId: string,
  userId: string,
  rating: number
) {
  if (userId === GUEST_USER_ID)
    throw new Error("Guest users cannot give ratings.")

  await dbConnect()
  const existingRating = await Rating.findOne({ storyId, userId })

  if (existingRating) {
    // rating is unchanged
    if (existingRating.rating === rating) return false

    existingRating.rating = rating
    await existingRating.save()
  } else
    await new Rating({
      storyId,
      userId,
      rating,
    }).save()

  return true
}

export async function db_updateRating(
  storyId: string,
  userId: string,
  value: number
) {
  await dbConnect()

  const activityAlreadyExists = await Rating.findOne({ storyId, userId })
  if (!activityAlreadyExists) {
    await new Activity({
      storyId,
      userId,
    }).save()
  }
}
//#endregion
