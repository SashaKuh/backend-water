import { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 15,
    },
  },
  { versionKey: false }
);

const Token = model("token", tokenSchema);

export default Token;
