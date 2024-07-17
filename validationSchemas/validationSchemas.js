const Joi = require("joi");

const registerUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.email": "Email must be a valid format",
      "any.required": "Email is required",
    }),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.email": "Email must be a valid format",
      "any.required": "Email is required",
    }),
  otp: Joi.string().length(6).required(),
});

const updateUserAndCreateCompanySchema = Joi.object({
  fullname: Joi.string().max(50).required().messages({
    "string.base": `"must be a string`,
    "string.empty": `is required`,
    "string.max": `fullname length must be less than or equal to {#limit} characters long`,
  }),
  country_code: Joi.string(),
  mobile_number: Joi.string()
    .pattern(/^\d+$/)
    .min(10)
    .max(15)
    .messages({
      "string.pattern.base": "Mobile number must contain only digits (0-9)",
      "string.empty": "Mobile number is required",
      "string.min": "Mobile number must be at least {#limit} digits long",
      "string.max": "Mobile number cannot exceed {#limit} digits",
    })
    .required(),
  company_name: Joi.string().max(50).required().messages({
    "string.max": `company name length must be less than or equal to {#limit} characters long`,
  }),
  min_company_size: Joi.number().integer(),
  max_company_size: Joi.number().integer(),
  company_website: Joi.string().uri(),
});

const externalUrlValidationSchema = Joi.object({
  content_url: Joi.string().uri().required().messages({
    "string.empty": "Content URL is required",
    "any.required": "Content URL is required",
    "string.uri": "Content URL must be a valid URI",
  }),
});

const singleFAQSchema = Joi.object({
  title: Joi.string().optional(),
  type: Joi.string().required().messages({
    "string.empty": "Type is required",
    "any.required": "Type is required",
  }),
  question: Joi.string().required().messages({
    "string.empty": "Question is required",
    "any.required": "Question is required",
  }),
  answer: Joi.string().required().messages({
    "string.empty": "Answer is required",
    "any.required": "Answer is required",
  }),
});

module.exports = {
  registerUserSchema,
  verifyOTPSchema,
  updateUserAndCreateCompanySchema,
  externalUrlValidationSchema,
  singleFAQSchema,
};
