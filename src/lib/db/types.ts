import { BrowseTabEnum, Genre } from "../defs"
import { json } from "../utils"
import dbConnect from "./connect"

/**
 * For debugging; DEFAULT, ERROR
 */
export enum LogIcon {
  DEFAULT = "🌱",
  ERROR   = "🍂",
  INFO    = "🍃",
}

/// Store types for the database here
export type DBUserRecord = {
  name: string
}

export type StoryFilter = {
    userId: string | null,
    title: string,
    tab: BrowseTabEnum,
    limit: number,
    genre: Genre,
    showRead: boolean,
}

export enum QueryType
{
  LIKE_INSENSITIVE,
  LIKE_SENSITIVE,
}

export async function PERFORM_DATABASE_ACTION(callback: () => Promise<any>) {
  await dbConnect()
  const data = json( await callback() )
  return data
}