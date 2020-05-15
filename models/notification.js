const { Schema, model } = require('mongoose')

const notificationSchema = new Schema({
  targetId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  actionerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

module.exports = model('notifications', notificationSchema)