const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const createUser = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    email: Joi.string().required().email(),
    mobile_number: Joi.number().required().integer().min(10 ** 9).max(10 ** 10 - 1),
    password: Joi.string().required().custom(password),
    user_question_answers: Joi.array(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    fullname: Joi.string(),
    email: Joi.string(),
    mobile_number: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      fullname: Joi.string().required(),
      email: Joi.string().required().email(),
      mobile_number: Joi.number().required().integer().min(10 ** 9).max(10 ** 10 - 1)
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
