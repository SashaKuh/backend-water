import express from "express";
import authController from "../controllers/auth-controller.js";
import validateBody from "../decorators/validateBody.js";
import {
  authForgotPasswordSchema,
  authUserSchema,
} from "../schemas/user-shemas.js";
import { isEmptyBody } from "../helpers/index.js";
import { authenticate } from "../middlewars/index.js";

const authRoute = express.Router();

authRoute.post(
  "/signup",
  isEmptyBody,
  validateBody(authUserSchema),
  authController.signup
);

authRoute.post(
  "/signin",
  isEmptyBody,
  validateBody(authUserSchema),
  authController.signin
);

authRoute.post("/signout", authenticate, authController.signout);

authRoute.post(
  "/reset-password",
  isEmptyBody,
  validateBody(authForgotPasswordSchema),
  authController.forgotPassword
);

export default authRoute;
