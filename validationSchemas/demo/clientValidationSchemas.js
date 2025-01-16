const Joi = require("joi");
const moment = require("moment");

const registerDemoClientSchema = Joi.object({
  id: Joi.string().hex().length(24).optional(),
  name: Joi.string()
    .pattern(/^(?=.*\d)[a-zA-Z0-9 ]+$/)
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.base": `"name" must be a string.`,
      "string.empty": `"name" is required.`,
      "string.max": `"name" must be less than or equal to 50 characters.`,
      "string.pattern.base": `"name" must contain letters, numbers, spaces, and at least one number.`,
    }),
  ttl: Joi.string()
    .custom((value, helper) => {
      const formattedDate = moment(value, "MM/DD/YYYY hh:mmA", true);
      if (!formattedDate.isValid()) {
        return helper.message(`"ttl" must be a valid date in MM/DD/YYYY hh:mmA format.`);
      }
      return formattedDate.toDate();
    })
    .optional(),
  email_ids: Joi.array().items(Joi.string().email()).optional().default([]),
  url: Joi.string().optional(),
  title: Joi.string().optional(),
  status: Joi.string()
    .valid("Initiated", "Active", "Expired")
    .default("Initiated")
    .optional(),
});

module.exports = {
  registerDemoClientSchema,
};
