const router = require('express').Router()
const auth = require('./auth')
const settings = require('./settings')
const users = require('./users')
const posts = require('./posts')
const notifications = require('./notifications')
const { checkAuth } = require('../middlewares/checkAuth')

router.use('/auth', auth)

router.use(checkAuth)

router.use('/settings', settings)
router.use('/posts', posts)
router.use('/users', users)
router.use('/notifications', notifications)

module.exports = router