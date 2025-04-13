/**
 * Atoms are Jotai's way of handling state across components.
 */

import { atom } from "jotai";
import { StoryType } from "./schemata/story";
import { HudMessageType, HudMessageTypeEnum } from "@/components/HudMessage";
import { Genre } from "./defs";

/**
 * The current query, to lower case
 */
export const queryAtom = atom<string>("")
export const genreAtom = atom<Genre>(Genre.NONE)
export const selectedStoryAtom = atom<StoryType>()

export const hudMessageAtom = atom<HudMessageType>()
export const showReadAtom = atom<boolean>(true)


export const guestLastPostedAtom = atom<number>()