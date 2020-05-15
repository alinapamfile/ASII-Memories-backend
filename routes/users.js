const router = require('express').Router()
const { userController } = require('../controllers')

router.get('/:userId', userController.getUser)
router.get('/:userId/posts', userController.getUserPosts)
router.get('/search/:name', userController.getUsersMatching)

module.exports = router