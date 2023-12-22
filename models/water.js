import { Schema, model } from "mongoose";

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
  },
  { versionKey: false }
);

const Entry = model("entry", entrySchema);

export default Entry;
