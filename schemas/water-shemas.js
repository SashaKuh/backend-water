import Joi from "joi";

const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const errorMessage = (field) => {
  return {
    "number.base": `${field} must be a number`,
    "number.min": "Minimal value is 1",
    "number.max": "Maximal value is 1500",
    "any.required": `${field} is required field`,
    "string.pattern.base": "Date must match ISO format",
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
  date: Joi.string()
    .pattern(dateRegex)
    .required()
    .messages(errorMessage("date")),
});

export const waterEditSchema = Joi.object({
  waterVolume: Joi.number()
    .min(1)
    .max(1500)
    .required()
    .messages(errorMessage("waterVolume")),
  date: Joi.string()
    .pattern(dateRegex)
    .required()
    .messages(errorMessage("date")),
});

export const waterDateSchema = Joi.object({
  date: Joi.string()
    .pattern(dateRegex)
    .required()
    .messages(errorMessage("date")),
});
