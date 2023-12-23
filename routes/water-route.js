import express from "express";
import waterController from "../controllers/water-controller.js";
import { validateBody } from "../decorators/index.js";
import { isEmptyBody } from "../helpers/index.js";
import { waterEntrySchema, waterDailySchema } from "../schemas/water-shemas.js";

const waterRoute = express.Router();

waterRoute.patch(
  "/rate",
  isEmptyBody,
  validateBody(waterDailySchema),
  waterController.rateDaily
);

waterRoute.post(
  "/add",
  isEmptyBody,
  validateBody(waterEntrySchema),
  waterController.addEntry
);

export default waterRoute;
