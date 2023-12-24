import { ctrlWrapper, httpError } from "../decorators/index.js";
import User from "../models/users.js";
import Entry from "../models/water.js";

const rateDaily = async (req, res, next) => {
  const { dailyNorma } = req.body;
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { dailyNorma });
  if (!result) {
    return next(httpError(404, "Not found"));
  }
  res.json(result);
};

const addEntry = async (req, res) => {
  const { _id: owner } = req.user;
  await Entry.create({ ...req.body, owner });
  res.status(201).send();
};

const editEntry = async (req, res, next) => {
  const { entryId } = req.params;
  const { _id: owner } = req.user;
  const result = await Entry.findOneAndUpdate(
    { _id: entryId, owner },
    req.body
  );
  if (!result) {
    return next(httpError(404, "Not found"));
  }
  res.json(result);
};

const deleteEntry = async (req, res, next) => {
  const { entryId } = req.params;
  const { _id: owner } = req.user;
  const result = await Entry.findOneAndDelete({ _id: entryId, owner });
  if (!result) {
    return next(httpError(404, "Not found"));
  }
  res.status(204).send();
};

export default {
  rateDaily: ctrlWrapper(rateDaily),
  addEntry: ctrlWrapper(addEntry),
  editEntry: ctrlWrapper(editEntry),
  deleteEntry: ctrlWrapper(deleteEntry),
};
