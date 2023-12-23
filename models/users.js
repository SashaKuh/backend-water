import { Schema, model } from "mongoose";

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
      required: [true, "Gender is required"],
    },
    dailyNorma: {
      type: String,
      default: "1.5",
    },
    avatarURL: {
      type: String,
      required: [true, "Avatar is required"],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", usersSchema);

export default User;
