import express from "express";
import waterController from "../controllers/water-controller.js";
import { validateBody } from "../decorators/index.js";
import { isEmptyBody } from "../helpers/index.js";
import {
  waterEntrySchema,
  waterDailySchema,
  waterEditSchema,
} from "../schemas/water-shemas.js";
import { isValidId } from "../helpers/index.js";
import { authenticate } from "../middlewars/index.js";

const waterRoute = express.Router();

waterRoute.use(authenticate);

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

waterRoute.put(
  "/:entryId",
  isValidId,
  isEmptyBody,
  validateBody(waterEditSchema),
  waterController.editEntry
);

waterRoute.delete("/:entryId", isValidId, waterController.deleteEntry);

waterRoute.get("/today/:date", waterController.getToday);

waterRoute.get("/month/:date", waterController.getMonth);

export default waterRoute;
