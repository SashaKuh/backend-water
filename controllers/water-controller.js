import { ctrlWrapper, httpError } from "../decorators/index.js";
import { generateDays, formatMonth } from "../helpers/index.js";
import User from "../models/users.js";
import Entry from "../models/water.js";

const rateDaily = async (req, res, next) => {
  const { dailyNorma } = req.body;
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(
    _id,
    { dailyNorma },
    { returnDocument: "after" }
  );
  if (!result) {
    return next(httpError(404, "Not found"));
  }
  res.json(result);
};

const addEntry = async (req, res) => {
  const { _id: owner } = req.user;
  const { dailyNorma } = await User.findById(owner, "-_id dailyNorma");
  if (!dailyNorma) {
    return next(httpError(404, "Not found"));
  }
  await Entry.create({ ...req.body, dailyNorma, owner });
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

const getToday = async (req, res, next) => {
  const { date } = req.body;
  const { _id: owner } = req.user;

  const todayRegex = new RegExp(date.split("T")[0]);

  const entries = await Entry.aggregate([
    { $match: { date: { $regex: todayRegex }, owner } },
    {
      $group: {
        _id: null,
        entries: {
          $push: { _id: "$_id", waterVolume: "$waterVolume", date: "$date" },
        },
        total: { $sum: "$waterVolume" },
        dailyNorma: { $last: "$dailyNorma" },
      },
    },
    {
      $project: {
        _id: 0,
        entries: 1,
        completed: {
          $round: [
            { $multiply: [{ $divide: ["$total", "$dailyNorma"] }, 100] },
          ],
        },
      },
    },
  ]);

  res.json(entries);
};

const getMonth = async (req, res, next) => {
  const { date } = req.body;
  const { _id: owner } = req.user;

  const dateSplitted = date.split("T")[0].substring(0, 7).split("-");
  const amountOfDays = generateDays(dateSplitted[0], dateSplitted[1]);

  const monthRegex = new RegExp(dateSplitted.join("-"));

  const monthEntries = await Entry.aggregate([
    { $match: { date: { $regex: monthRegex }, owner } },
    { $project: { waterVolume: 1, date: 1, dailyNorma: 1 } },
    {
      $bucket: {
        groupBy: {
          $dayOfMonth: {
            $dateFromString: {
              dateString: "$date",
            },
          },
        },
        boundaries: amountOfDays,
        output: {
          servings: { $sum: 1 },
          date: { $last: "$date" },
          dailyNorma: { $last: "$dailyNorma" },
          total: { $sum: "$waterVolume" },
        },
      },
    },
    {
      $project: {
        date: {
          $concat: [
            formatMonth(dateSplitted[1] - 1),
            ",",
            { $toString: { $dayOfMonth: { $toDate: "$date" } } },
          ],
        },
        servings: 1,
        dailyNorma: { $divide: ["$dailyNorma", 1000] },
        completed: {
          $round: [
            { $multiply: [{ $divide: ["$total", "$dailyNorma"] }, 100] },
          ],
        },
      },
    },
    {
      $densify: {
        field: "_id",
        range: {
          step: 1,
          bounds: [1, amountOfDays.length],
        },
      },
    },
    {
      $fill: {
        output: {
          date: { value: null },
          servings: { value: null },
          dailyNorma: { value: null },
          completed: { value: null },
        },
      },
    },
  ]);

  res.json(monthEntries);
};

export default {
  rateDaily: ctrlWrapper(rateDaily),
  addEntry: ctrlWrapper(addEntry),
  editEntry: ctrlWrapper(editEntry),
  deleteEntry: ctrlWrapper(deleteEntry),
  getToday: ctrlWrapper(getToday),
  getMonth: ctrlWrapper(getMonth),
};
