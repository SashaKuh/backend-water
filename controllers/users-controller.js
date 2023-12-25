import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config.js";
import fs from "fs/promises";
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

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

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

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!req.file) {
    throw httpError(400, "Upload avatar file");
  }

  await cloudinary.uploader
    .upload(req.file.path, {
      folder: "water-project/avatars",
      resource_type: "image",
      transformation: [
        {
          height: 100,
          width: 100,
          crop: "lfill",
        },
      ],
    })
    .then(async ({ public_id }) => {
      if (!user.avatarURL.includes("gravatar")) {
        await cloudinary.api.delete_resources([user.avatarURL], {
          type: "upload",
          resource_type: "image",
        });
      }

      await User.findByIdAndUpdate(
        _id,
        { avatarURL: public_id },
        { returnDocument: "after" }
      );

      res.status(200).json({ avatarURL: public_id });
    })
    .catch((e) => {
      throw httpError(408, "Request timeout. Not response from cloudinary.");
    })
    .finally(() => {
      fs.unlink(req.file.path);
    });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  current: ctrlWrapper(current),
  updateUserData: ctrlWrapper(updateUserData),
  updateAvatar: ctrlWrapper(updateAvatar),
};
