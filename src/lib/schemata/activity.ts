import mongoose, { Model, Schema, InferSchemaType } from "mongoose";

const schema = new Schema({
  // _id is implicit
  userId: {
    type: String,
    required: true,
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
});

type ActivityType = InferSchemaType<typeof schema> & { 
  _id: mongoose.Types.ObjectId | string, 
  userId: mongoose.Types.ObjectId | string, 
  storyId: mongoose.Types.ObjectId | string, 
}

const model: Model<ActivityType> = mongoose.models.Activity || mongoose.model("Activity", schema, "activity");
export default model;
export type { ActivityType };
