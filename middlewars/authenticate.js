import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";

const { JWT_SECRET } = process.env;

const func = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw httpError(401, "Not authorized");
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer.toLowerCase() !== "bearer") {
    throw httpError(401, "Not authorized");
  }

  try {
    const { _id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(_id);

    if (!user || !user.token || user.token !== token) {
      throw httpError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch {
    throw httpError(401, "Not authorized");
  }
};

const authenticate = ctrlWrapper(func);

export default authenticate;
