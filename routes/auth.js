const router = require('express').Router()
const { authController } = require('../controllers')
const { dataValidation } = require('../middlewares/dataValidation')
const { auth } = require('../schemas')

router.post('/register', dataValidation(auth.register), authController.register)
router.post('/login', dataValidation(auth.login), authController.login)
router.patch('/confirm', authController.confirm)
router.post('/forgot_password', dataValidation(auth.forgotPassword), authController.forgotPassword)
router.patch('/reset_password', authController.resetPassword)

module.exports = router