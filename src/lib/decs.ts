/**
 * Declarations for global constants
 */

import { UserProfile } from "@auth0/nextjs-auth0/client";
import { ConnectOptions } from "mongoose";

export const MONGO_CONN_PARAMS: ConnectOptions = { 
  bufferCommands: false,
}

export const GUEST_USER_ID = "11037"
export const GUEST_USER: UserProfile = {
  sub: GUEST_USER_ID,
  nickname: "Guest",
  picture: undefined,
}

// time in ms that a guest must wait before posting again (5 mins)
export const GUEST_UPLOAD_TIMEOUT = 1_000 * 5 * 60

export const LOAD_INCREMENT = 20