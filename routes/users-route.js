import express from "express";
import userController from "../controllers/users-controller.js";

const usersRoute = express.Router();

usersRoute.get("/", userController.createUser);

export default usersRoute;
