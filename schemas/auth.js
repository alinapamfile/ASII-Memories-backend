const Joi = require('@hapi/joi')

const register = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  departments: Joi.object().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

const forgotPassword = Joi.object({
  email: Joi.string().email().required()
})

module.exports = { register, login, forgotPassword }