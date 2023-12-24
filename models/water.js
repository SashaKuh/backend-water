import { Schema, model } from "mongoose";
import { handleSaveError, enableUpdateOptions } from "./hooks.js";

const dateRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

const entrySchema = new Schema(
  {
    waterVolume: {
      type: Number,
      min: [1, "value is less than minimum allowed value (1)."],
      max: [1500, "value is more than maximum allowed value (1500)."],
      required: [true, "value is required."],
    },
    date: {
      type: String,
      match: [
        dateRegExp,
        "value does not match the allowed format (YYYY-MM-DDTHH:MM:SS)",
      ],
      required: [true, "value is required."],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

entrySchema.post("save", handleSaveError);

entrySchema.pre("findOneAndUpdate", enableUpdateOptions);
entrySchema.post("findOneAndUpdate", handleSaveError);

const Entry = model("entry", entrySchema);

export default Entry;
