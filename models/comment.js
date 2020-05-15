const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  likes: {
    type: Array,
    default: []
  }
})

module.exports = model('comments', commentSchema)