import { httpError } from "../decorators/index.js";

const validateBody = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(httpError(400, error.message));
    }
    next();
  };
};

export default validateBody;
