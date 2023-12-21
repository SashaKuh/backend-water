import express from "express";

const app = express();

// example
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Server work correct" });
});

export default app;
