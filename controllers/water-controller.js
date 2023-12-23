import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";
import Entry from "../models/water.js";

const rateDaily = async (req, res) => {
  /**const {dailyNorma} = req.body
   * const {id} = req.user
   *const result = await User.findByIdAndUpdate(id, {dailyNorma})
    if (!result) {
    return next(httpError(404, "Not found"));
   }
   res.json({
    message: "Successfully updated"
   })
   */
};

const addEntry = async (req, res) => {
  // const {id: owner} = req.user;
  await Entry.create({ ...req.body });
  res.status(201).send();
};

export default {
  rateDaily: ctrlWrapper(rateDaily),
  addEntry: ctrlWrapper(addEntry),
};
