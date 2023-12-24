import { isValidObjectId } from "mongoose";
import { httpError } from "../decorators/index.js";

const isValidId = (req, res, next) => {
  const { entryId } = req.params;
  if (!isValidObjectId(entryId)) {
    return next(httpError(404, `${entryId} is not valid id`));
  }
  next();
};

export default isValidId;
