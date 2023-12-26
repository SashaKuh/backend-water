import express from "express";
import cors from "cors";
import logger from "morgan";
import swager from "swagger-ui-express";
import fs from "fs/promises";
import path from "path";

const pathSwagerDocument = path.resolve("./swager.json");
const swagerDocument = await fs.readFile(pathSwagerDocument, "utf8");

import { usersRoute, waterRoute } from "./routes/index.js";

const app = express();
const formatLogger = app.get("env");

app.use(logger(formatLogger));
app.use(cors());
app.use(express.json());
app.use("/docs", swager.serve, swager.setup(JSON.parse(swagerDocument)));

app.use("/users", usersRoute);
app.use("/water", waterRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});
app.use(({ status = 500, message = "Server error" }, req, res, next) => {
  res.status(status).json({ message });
});

export default app;
