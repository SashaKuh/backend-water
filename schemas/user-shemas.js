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
