import { httpError } from "../decorators/index.js";

const validateBody = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const { type, path: notAllowed } = error.details[0];
      if (type === "object.unknown") {
        error.message = `Field ${notAllowed[0]} is not allowed.`;
      }
      return next(httpError(400, error.message));
    }
    next();
  };
};

export default validateBody;
