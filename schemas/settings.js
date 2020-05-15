const Joi = require('@hapi/joi')

const changePassword = Joi.object({
  oldPass: Joi.string().min(6).required(),
  newPass: Joi.string().min(6).required()
})

const editUser = Joi.object({
  description: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  departments: Joi.object().optional()
})

module.exports = { changePassword, editUser }