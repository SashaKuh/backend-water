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
   res.json(result)
   */
};

const addEntry = async (req, res) => {
  // const {id: owner} = req.user;
  const result = await Entry.create({ ...req.body });
  res.json(result);
};

const editEntry = async (req, res) => {
  const { entryId } = req.params;
  // const {id: owner} = req.user;
  const result = await Entry.findByIdAndUpdate(entryId, req.body);
  if (!result) {
    return next(httpError(404, "Not found"));
  }
  res.json(result);
};

export default {
  rateDaily: ctrlWrapper(rateDaily),
  addEntry: ctrlWrapper(addEntry),
  editEntry: ctrlWrapper(editEntry),
};
