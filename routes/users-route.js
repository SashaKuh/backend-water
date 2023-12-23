import express from "express";
import userController from "../controllers/users-controller.js";
import validateBody from "../decorators/validateBody.js";
import { signupUserSchema } from "../schemas/user-shemas.js";
import { isEmptyBody } from "../helpers/index.js";

const usersRoute = express.Router();

usersRoute.post(
  "/signup",
  isEmptyBody,
  validateBody(signupUserSchema),
  userController.signup
);

export default usersRoute;
