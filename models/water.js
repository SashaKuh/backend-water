import { Schema, model } from "mongoose";
import { handleSaveError, enableUpdateOptions } from "./hooks.js";

const entrySchema = new Schema(
  {
    waterVolume: {
      type: Number,
      min: [1, "value is less than minimum allowed value (1)."],
      max: [1500, "value is more than maximum allowed value (1500)."],
      required: [true, "value is required."],
    },
    date: {
      type: Date,
      required: [true, "value is required."],
    },
    dailyNorma: {
      type: Number,
      default: 2000,
      max: 15000,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);

entrySchema.post("save", handleSaveError);

entrySchema.pre("findOneAndUpdate", enableUpdateOptions);
entrySchema.post("findOneAndUpdate", handleSaveError);

const Entry = model("entry", entrySchema);

export default Entry;
