import multer from "multer";
import path from "path";
import { httpError } from "../decorators/index.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const limits = {
  fileSize: 3 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const whiteListMimetype = ["image/jpeg", "image/png"];
  if (whiteListMimetype.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(
    httpError(
      415,
      `File mimetype must be one of: ${whiteListMimetype.join(", ")}`
    )
  );
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
