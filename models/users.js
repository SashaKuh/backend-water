import { Schema, model } from "mongoose";
import { stringify } from "querystring";

const usersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    gender: {
      type: String,
      enum: ["man", "girl"],
      default: "girl",
      required: [true, "Avatar is required"],
    },
    dailyNorma: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", usersSchema);

export default User;
