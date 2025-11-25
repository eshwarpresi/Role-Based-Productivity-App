const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('pending', 'in progress', 'completed').default('pending')
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, taskValidation };