/**
 * Definitions for types; eg enums, classes, etc
 */

import { Bedtime, Favorite, SvgIconComponent, TheaterComedy, AutoFixHigh, Schedule, EmojiEmotions, QuestionMark } from "@mui/icons-material";

/**
 * Genre of the given story. These are mapped to integers for database storage.
 */
export enum Genre {
  NONE = 0,
  HORROR,
  COMEDY,
  ROMANCE,
  FANTASY,
  MYSTERY,
  DRAMA,
  HISTORICAL,
  // etc
}

export const genreEmojis: Record<string, string> = {
  ["NONE"]: "❓",
  ["COMEDY"]: "😂",
  ["HORROR"]: "👻",
  ["ROMANCE"]: "❤️",
  ["FANTASY"]: "🧙",
  ["MYSTERY"]: "🕵️",
  ["DRAMA"]: "🎭",
  ["HISTORICAL"]: "📜",
}

export const genreIcons: Record<string, SvgIconComponent | null> = {
  ["NONE"]: null,
  ["COMEDY"]: EmojiEmotions,
  ["HORROR"]: Bedtime,
  ["ROMANCE"]: Favorite,
  ["FANTASY"]: AutoFixHigh, // Replace with an appropriate icon
  ["MYSTERY"]: QuestionMark, // Replace with an appropriate icon
  ["DRAMA"]: TheaterComedy, // Replace with an appropriate icon
  ["HISTORICAL"]: Schedule, // Replace with an appropriate icon
};


/**
 * Genre of the given story. These are mapped to integers for database storage.
 */
export enum Visibility {
  PRIVATE = 0,
  PUBLIC,
  DRAFT, // for expansion
}

export interface PublishedStoryType {
  userId: string,
  storyId: string,
}

export enum BrowseTabEnum {
  NEW = 0,
  TOP,
  SUGGESTED,
}

export enum PopulateStoryType {
  GUEST = 0,
  FIXED_GENRE
}