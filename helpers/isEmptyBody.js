import { httpError } from "../decorators/index.js";

const isEmptyBody = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (!keys.length) {
    next(httpError(400, "missing fields"));
  }
  next();
};

export default isEmptyBody;
