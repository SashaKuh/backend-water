import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/users.js";

const createUser = async () => {
  // await User.create({
  //   email: "test@mail.com",
  //   password: "password",
  //   username: "user",
  //   gender: "girl",
  // });
};

export default { createUser: ctrlWrapper(createUser) };
