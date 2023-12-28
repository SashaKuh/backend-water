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

const getToday = async (req, res, next) => {
  const { date } = req.body;
  const { _id: owner } = req.user;

  const { dailyNorma } = await User.findById(owner, "-_id dailyNorma");
  if (!dailyNorma) {
    return next(httpError(404, "Not found"));
  }

  const todayRegex = new RegExp(date.split("T")[0]);

  const entries = await Entry.aggregate([
    { $match: { date: { $regex: todayRegex }, owner } },
    { $project: { waterVolume: 1, date: 1 } },
  ]);

  const todayAmount = entries.reduce((sum, { waterVolume }) => {
    sum += waterVolume;
    return sum;
  }, 0);
  const completed =
    (todayAmount / dailyNorma) * 100 > 100
      ? 100
      : Math.round((todayAmount / dailyNorma) * 100);

  res.json({
    entries,
    completed,
  });
};

// const getMonth = async (req, res, next) => {
//   const { date } = req.body;
//   const { _id: owner } = req.user;

//   const monthRegex = new RegExp(date.split("T")[0].substring(0, 7));

//   const monthEntries = await Entry.aggregate([
//     { $match: { date: { $regex: monthRegex }, owner } },
//     { $project: { waterVolume: 1, date: 1 } },
//     {
//       $bucket: {
//         groupBy: {
//           $dayOfMonth: {
//             $dateFromString: {
//               dateString: "$date",
//             },
//           },
//         },
//         boundaries: [0, 31],
//         output: {
//           count: { $sum: 1 },
//           entries: {
//             $push: {
//               waterVolume: "$waterVolume",
//               date: "$date",
//             },
//           },
//         },
//       },
//     },
//   ]);

//   res.json(monthEntries);
// };

export default {
  rateDaily: ctrlWrapper(rateDaily),
  addEntry: ctrlWrapper(addEntry),
  editEntry: ctrlWrapper(editEntry),
  deleteEntry: ctrlWrapper(deleteEntry),
  getToday: ctrlWrapper(getToday),
  // getMonth: ctrlWrapper(getMonth),
};
