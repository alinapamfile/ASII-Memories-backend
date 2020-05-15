const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  departments: {
    type: Object,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  profilePhoto: {
    type: String,
    default: null
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  passwordResetFlag: {
    type: Boolean,
    default: false
  }
})

module.exports = model('users', userSchema)