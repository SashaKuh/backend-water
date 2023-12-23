import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const notUniqueUser = await User.findOne({ email });

  if (notUniqueUser) {
    throw httpError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = email.split("@")[0];

  const avatarSettings = { s: "250", r: "g", d: "retro" };
  const avatarURL = gravatar.url(email, avatarSettings, true);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    username,
    avatarURL,
  });

  const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
    expiresIn: "23h",
  });

  const addToken = await User.findByIdAndUpdate(
    newUser._id,
    { token: token },
    { returnDocument: "after" }
  );

  res.status(201).json({
    email: newUser.email,
    username: newUser.username,
    avatarURL: newUser.avatarURL,
    token: addToken.token,
  });
};

export default { signup: ctrlWrapper(signup) };
