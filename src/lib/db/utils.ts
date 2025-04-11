import { ActivityType } from "../schemata/activity"
import { dbout } from "../utils"
import { auth0_fetchUserById, db_getUserActivity } from "./get"
import { LogIcon } from "./types"


/**
 * An partial match; **CaSE inSEnSItiVe**
 */
export function db_like( query: string )
{
  return new RegExp( query, "i" )
}

/**
 * An exact match; **CaSE inSEnSItiVe**
 */
export function db_exact( query: string )
{
  return new RegExp(`^${query}$`, "i")
}

/**
 * An exact match; **CaSE inSEnSItiVe**
 */
export function db_strictExact( query: string )
{
  return new RegExp(`^${query}$`)
}


/**
 * Takes a callback to query the database and returns `true` if the query returns **has a truthy value**
 */
export async function db_exists( callback: () => Promise<any> )
{
  const data = await callback()

  if ( data )
    dbout( LogIcon.INFO, `Data in db_exist request did exist` )
  else 
    dbout( LogIcon.INFO, `Data in db_exist request not found` )

  return Boolean(data)
}

/**
 * Should this story be shown to the user?
 */
export async function shouldShow( option: boolean, userId: string, storyId: string ): Promise<boolean>
{
  if ( !option ) return true
  return await userHasSeenPost(userId, storyId)
}

export async function userHasSeenPost(userId: string, storyId: string): Promise<boolean>
{
  const userActivity = await db_getUserActivity(userId)
  return userActivity.some( (activity: ActivityType) => activity.storyId === storyId )
}