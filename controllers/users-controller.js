import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config.js";
import fs from "fs/promises";
import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";

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

export default {
  current: ctrlWrapper(current),
  updateUserData: ctrlWrapper(updateUserData),
  updateAvatar: ctrlWrapper(updateAvatar),
};
