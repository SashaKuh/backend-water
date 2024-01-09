import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config.js";
import fs from "fs/promises";
import path from "path";
import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";
import { deleteUserLatter } from "../helpers/mailLatters.js";
import { sendMail } from "../helpers/index.js";
import Entry from "../models/water.js";

const { FRONTEND_URL, JWT_SECRET } = process.env;

const current = async (req, res, next) => {
  const { _id } = req.user;
  const result = await User.findById(_id);

  if (!result) {
    throw httpError(401, "Not authorized");
  }
  const { email, username, gender, avatar, dailyNorma } = result;

  res
    .status(200)
    .json({ email, username, gender, avatar: { URL: avatar.URL }, dailyNorma });
};

const updateUserData = async (req, res, next) => {
  const { body } = req;
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (body.password?.oldPassword && body.password?.newPassword) {
    const match = await bcrypt.compare(
      body.password.oldPassword,
      user.password
    );

    if (!match) {
      throw httpError(400, "Field oldPassword is wrong value");
    }

    body.password = await bcrypt.hash(body.password.newPassword, 10);
  }

  const result = await User.findByIdAndUpdate(
    _id,
    { ...body },
    { returnDocument: "after" }
  );

  if (!result) {
    httpError(401, "Not authorized");
  }

  const { email, username, gender, avatar, dailyNorma } = result;

  res.status(200).json({
    email,
    username,
    gender,
    avatar: { URL: avatar.URL },
    dailyNorma,
  });
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
          crop: "lpad",
        },
      ],
    })
    .then(async ({ public_id, secure_url }) => {
      if (user.avatar.public_id) {
        await cloudinary.api.delete_resources([user.avatar.public_id], {
          type: "upload",
          resource_type: "image",
        });
      }

      await User.findByIdAndUpdate(
        _id,
        { avatar: { public_id, URL: secure_url } },
        { returnDocument: "after" }
      );

      res.status(200).json({ avatar: { URL: secure_url } });
    })
    .catch((e) => {
      throw httpError(408, "Request timeout. Not response from cloudinary.");
    })
    .finally(() => {
      fs.unlink(req.file.path);
    });
};

export const deleteUserRequest = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  const link = path.join(FRONTEND_URL, "delete");

  const letter = deleteUserLatter(
    "rostyslav.stetsyk1999@gmail.com",
    user.username,
    link
  );

  await sendMail(letter);

  res.status(202).json({
    message:
      "Delete account request accepted. Confirmation email has been sent.",
  });
};

export const deleteUser = async (req, res, next) => {
  const { password } = req.params;
  const { _id } = req.user;

  if (!deleteToken) {
    throw httpError(400, "Invalid or delete account token");
  }

  const { password: hashedPassword } = await User.findById(_id);
  const compare = bcrypt.compare(hashedPassword, password);

  if (!compare) throw httpError(400, "Bad password");

  await User.findByIdAndDelete(_id);
  await Entry.deleteMany({ owner: _id });

  res.status(204);
};

export default {
  current: ctrlWrapper(current),
  updateUserData: ctrlWrapper(updateUserData),
  updateAvatar: ctrlWrapper(updateAvatar),
  deleteUser: ctrlWrapper(deleteUser),
  deleteUserRequest: ctrlWrapper(deleteUserRequest),
};
