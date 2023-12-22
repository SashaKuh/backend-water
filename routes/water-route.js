import express from "express";
import waterController from "../controllers/water-controller.js";

const waterRoute = express.Router();

waterRoute.post("/rate", waterController.rateDaily);

export default waterRoute;
