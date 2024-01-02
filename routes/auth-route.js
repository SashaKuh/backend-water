import express from "express";
import authController from "../controllers/auth-controller.js";
import validateBody from "../decorators/validateBody.js";
import {
  authForgotPasswordSchema,
  authResetPasswordSchema,
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
  "/request-reset-password",
  isEmptyBody,
  validateBody(authForgotPasswordSchema),
  authController.requestForgotPassword
);

authRoute.patch(
  "/reset-password",
  isEmptyBody,
  validateBody(authResetPasswordSchema),
  authController.resetPassword
);

export default authRoute;
