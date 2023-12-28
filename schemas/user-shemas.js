import Joi from "joi";

const patternForEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const authUserSchema = Joi.object({
  email: Joi.string().required().pattern(patternForEmail).messages({
    "string.pattern.base": "The email must be in the format 'user@email.com'",
    "any.required": "Email is required field",
    "string.base": "Email must be a string",
  }),
  password: Joi.string().required().min(8).max(64).messages({
    "string.min": "Min length 8 symbols",
    "string.max: ": "Max length 64 symbols",
    "any.required": "Password is required field",
    "string.base": "Password must be a string",
  }),
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().pattern(patternForEmail).messages({
    "string.pattern.base": "The email must be in the format 'user@email.com'",
    "any.required": "Email is required field",
    "string.base": "Email must be a string",
  }),
  password: Joi.object({
    oldPassword: Joi.string().min(8).max(64).required().messages({
      "string.base": "Username must be a string",
      "string.min: ": "Min length 8 symbols",
      "string.max: ": "Max length 64 symbols",
      "any.required": "oldPassword is required field",
    }),
    newPassword: Joi.string().min(8).max(64).required().messages({
      "string.base": "Username must be a string",
      "string.min: ": "Min length 8 symbols",
      "string.max: ": "Max length 64 symbols",
      "any.required": "newPassword is required field",
    }),
  }),
  username: Joi.string().max(32).messages({
    "string.max: ": "Max length 32 symbols",
    "string.base": "Username must be a string",
  }),
  gender: Joi.string().valid("man", "girl").messages({
    "any.only": "The value must be either 'man' or 'girl'",
    "string.base": "Gender must be a string",
  }),
});
