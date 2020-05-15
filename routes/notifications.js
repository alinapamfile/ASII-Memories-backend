const router = require('express').Router()
const { notificationsController } = require('../controllers')

router.get('/', notificationsController.getNotifications)

module.exports = router