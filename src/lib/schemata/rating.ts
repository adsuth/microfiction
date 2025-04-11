import mongoose, { Model, Schema, InferSchemaType } from "mongoose"

const schema = new Schema({
  userId: {
      type: String,
      required: true,
  },
  storyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Story",
  },
  rating: {
      type: Number,
      required: true,
      validate: {
          validator: (num: number) => {
              const withinStarRating = num >= 0 && num <= 5
              return Number.isInteger(num) && withinStarRating
          },
          message: "{VALUE} is either not an integer or is outwith the star rating threshold"
      }
  }
})

type RatingType = InferSchemaType<typeof schema> & { _id: mongoose.Types.ObjectId | string }
const model: Model<RatingType> = mongoose.models.Rating || mongoose.model("Rating", schema, "rating")

export default model
export type { RatingType }