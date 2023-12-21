import express from "express";
import cors from "cors";
import { usersRoute, waterRoute } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRoute);
app.use("/water", waterRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});
app.use(({ status = 500, message = "Server error" }, req, res, next) => {
  res.status(status).json({ message });
});

export default app;
