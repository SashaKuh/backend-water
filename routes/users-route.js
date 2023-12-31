import express from "express";
import userController from "../controllers/users-controller.js";
import validateBody from "../decorators/validateBody.js";
import { userUpdateSchema } from "../schemas/user-shemas.js";
import { isEmptyBody } from "../helpers/index.js";
import { authenticate, upload } from "../middlewars/index.js";

const usersRoute = express.Router();

usersRoute.get("/current", authenticate, userController.current);

usersRoute.patch(
  "/update",
  authenticate,
  isEmptyBody,
  validateBody(userUpdateSchema),
  userController.updateUserData
);

usersRoute.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  userController.updateAvatar
);

export default usersRoute;
