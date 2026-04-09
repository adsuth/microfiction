import mongoose from "mongoose"
import { MONGO_CONN_PARAMS } from "../decs"

// ? stolen from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.ts

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache // This must be a `var` and not a `let / const`
}

let cached = globalThis.mongooseCache

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null }
}

export default async function dbConnect() {
  const MONGO_URI = process.env.MONGO_URI!

  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env (or run create-venv.sh)",
    )
  }

  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, MONGO_CONN_PARAMS).then((mongoose) => {
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}