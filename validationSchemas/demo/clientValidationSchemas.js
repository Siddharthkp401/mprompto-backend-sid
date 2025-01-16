const Joi = require("joi");

const registerDemoClientSchema = Joi.object({
  name: Joi.string().alphanum().max(50).required().messages({
    "string.base": `"must be a string`,
    "string.empty": `is required`,
    "string.max": `fullname length must be less than or equal to {#limit} characters long`,
  }),
  ttl: Joi.date().optional(),
  email_ids: Joi.array().items(Joi.string().email()).optional().default([]).messages({
  })
});

module.exports = {
  registerDemoClientSchema
};