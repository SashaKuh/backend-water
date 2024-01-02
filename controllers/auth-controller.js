import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config.js";
import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";
import Token from "../models/token.js";
import { sendMail } from "../helpers/index.js";
import { resetPasswordLatter } from "../helpers/mailLatters.js";
import crypto from "crypto";

const { JWT_SECRET, FRONTEND_URL } = process.env;

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
    avatar: { URL: avatarURL },
  });

  const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, {
    expiresIn: "23h",
  });

  const userWithToken = await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { returnDocument: "after" }
  );

  res.status(201).json({
    email: userWithToken.email,
    username: userWithToken.username,
    gender: userWithToken.gender,
    avatar: { URL: userWithToken.avatar.URL },
    dailyNorma: userWithToken.dailyNorma,
    token: userWithToken.token,
  });
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw httpError(401, "Email or password is wrong");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "23h",
  });

  const userWithToken = await User.findByIdAndUpdate(
    user._id,
    { token },
    { returnDocument: "after" }
  );

  res.status(200).json({
    email: userWithToken.email,
    username: userWithToken.username,
    gender: userWithToken.gender,
    avatar: { URL: userWithToken.avatar.URL },
    dailyNorma: userWithToken.dailyNorma,
    token: userWithToken.token,
  });
};

const signout = async (req, res, next) => {
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, { token: "" });

  if (!result) {
    throw httpError(401, "Not authorized");
  }

  res.status(204).send();
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(400, "User with this email does not exist");
  }

  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await Token.findOneAndDelete({ userId: user._id });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  await Token.create({
    userId: user._id,
    token: hashedToken,
  });

  const link = `${FRONTEND_URL}password-reset?token=${resetToken}&id=${user._id}`;

  const letter = resetPasswordLatter(email, user.username, link);

  await sendMail(letter);

  res.status(202).json({
    message:
      "Password reset request accepted. Confirmation email has been sent.",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  forgotPassword: ctrlWrapper(forgotPassword),
};
