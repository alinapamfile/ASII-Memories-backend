const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  likes: {
    type: Array,
    default: []
  },
  extension: {
    type: String,
    required: true
  }
})

module.exports = model('posts', postSchema)