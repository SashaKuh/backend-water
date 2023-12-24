import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
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

  const userWithToken = await User.findByIdAndUpdate(
    newUser._id,
    { token },
    { returnDocument: "after" }
  );

  res.status(201).json({
    email: userWithToken.email,
    username: userWithToken.username,
    avatarURL: userWithToken.avatarURL,
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
    avatarURL: userWithToken.avatarURL,
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

const current = async (req, res, next) => {
  const { _id } = req.user;
  const result = await User.findById(_id);

  if (!result) {
    throw httpError(401, "Not authorized");
  }
  const { email, username, avatarURL, dailyNorma } = result;

  res.status(200).json({ email, username, avatarURL, dailyNorma });
};

// temp
const updateUserData = async (req, res, next) => {
  const { body } = req;
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(
    _id,
    { ...body },
    { returnDocument: "after" }
  );

  if (!result) {
    httpError(401, "Not authorized");
  }

  const { email, username, avatarURL, dailyNorma } = result;

  res.status(200).json({ email, username, avatarURL, dailyNorma });
};

const updateAvatar = (req, res, next) => {
  cloudinary.uploader
    .upload("my_image.jpg")
    .then((result) => console.log(result));
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
  updateUserData: ctrlWrapper(updateUserData),
};
