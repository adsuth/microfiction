import mongoose, { Model, Schema, InferSchemaType } from "mongoose"
import { Genre, Visibility } from "../defs"

const schema = new Schema(
  {
    // _id is implicit
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 50, // change to appropriate
      trim: true,
    },
    blurb: {
      type: String,
      required: false,
      maxlength: 50, // change to appropriate
      trim: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500, // maybe check if this is inclusive
      trim: true,
    },
    visibility: {
      type: Number,
      default: 0,
      validate: {
        validator: (num: number) => {
          const withinEnum =
            num >= 0 && num < Object.keys(Visibility).length / 2
          return withinEnum && Number.isInteger(num)
        },
        message:
          "{VALUE} is either not an integer value, or is out of range for the Visibility enum",
      },
    },

    genre: {
      type: Number, // integer correlated to genre enum
      validate: {
        validator: (num: number) => {
          const withinEnum = num >= 0 && num < Object.keys(Genre).length / 2
          return withinEnum && Number.isInteger(num)
        },
        message:
          "{VALUE} is either not an integer value, or is out of range for the Genre enum",
      },
      default: 0,
    },

    thumbnail: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
)

type StoryType = InferSchemaType<typeof schema> & {
  _id: mongoose.Types.ObjectId | string
  rating?: number
  views?: number
  timestamp?: number
  createdAt: Date | NativeDate | string
  updatedAt: Date | NativeDate | string
}
const model: Model<StoryType> =
  mongoose.models.Story || mongoose.model("Story", schema, "story")

export default model
export type { StoryType }
