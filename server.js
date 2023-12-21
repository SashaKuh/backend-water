import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const { DB_HOST, PORT = 3000, BASE_URL } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log(
        `App listening on port ${PORT} \nServer URL: ${BASE_URL}:${PORT}`
      );
    })
  )
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
