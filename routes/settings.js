const router = require('express').Router()
const { settingsController } = require('../controllers')
const { dataValidation } = require('../middlewares/dataValidation')
const { settings } = require('../schemas')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})

router.patch('/change_password', dataValidation(settings.changePassword), settingsController.changePassword)
router.patch('/edit', dataValidation(settings.editUser), settingsController.editUser)
router.patch('/change_profile_photo', upload.single('file'), settingsController.changeProfilePhoto)

module.exports = router