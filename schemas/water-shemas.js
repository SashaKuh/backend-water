import Joi from "joi";

const errorMessage = (field) => {
  return {
    "number.base": `${field} must be a number`,
    "number.min": "Minimal value is 1",
    "number.max": "Maximal value is 1500",
    "any.required": `${field} is required field`,
    "date.base": "Date must be in right format",
    "date.format": "The date must match ISO format",
  };
};

export const waterDailySchema = Joi.object({
  dailyNorma: Joi.number()
    .min(0)
    .max(15000)
    .required()
    .messages({
      ...errorMessage("dailyNorma"),
      "number.max": "Maximal value is 15000",
      "number.min": "Minimal value is 0",
    }),
});

export const waterEntrySchema = Joi.object({
  waterVolume: Joi.number()
    .min(1)
    .max(1500)
    .required()
    .messages(errorMessage("waterVolume")),
  date: Joi.date().iso().required().messages(errorMessage("date")),
});

export const waterEditSchema = Joi.object({
  waterVolume: Joi.number()
    .min(1)
    .max(1500)
    .required()
    .messages(errorMessage("waterVolume")),
  date: Joi.date().iso().required().messages(errorMessage("date")),
});

export const waterMonthSchema = Joi.object({
  date: Joi.date().iso().required().messages(errorMessage("date")),
});
