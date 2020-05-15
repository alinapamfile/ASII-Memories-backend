const User = require('./user')
const Post = require('./post')
const Comment = require('./comment')
const Notification = require('./notification')

const db = {
  User,
  Post,
  Comment,
  Notification
}

module.exports = db