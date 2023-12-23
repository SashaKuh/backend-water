import Joi from "joi";

const dateRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const errorMessage = {
  "number.base": "Water volume must be a number",
  "number.min": "Minimal value is 1",
  "number.max": "Maximal value is 1500",
  "any.required": "Water volume is required field",
  "string.base": "Date must be a string",
  "string.pattern.base": "The date must be in the format YYYY-MM-DDTHH:MM:SS",
};

export const waterEntrySchema = Joi.object({
  waterVolume: Joi.number().min(1).max(1500).required().messages(errorMessage),
  date: Joi.string().pattern(dateRegExp).required().messages(errorMessage),
});

export const waterDailySchema = Joi.object({
  dailyNorma: Joi.number().max(15000).required().messages(errorMessage),
});

export const waterEditSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(1500).messages(errorMessage),
  date: Joi.string().pattern(dateRegExp).messages(errorMessage),
});
