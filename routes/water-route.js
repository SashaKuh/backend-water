import express from "express";
import waterController from "../controllers/water-controller.js";

const waterRoute = express.Router();

waterRoute.patch("/rate", waterController.rateDaily);

export default waterRoute;
