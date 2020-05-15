const HttpStatus = require('http-status-codes')
const bcrypt = require('bcrypt')

exports.changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body

    const user = await req.db.User.findOne({ email: req.user.email })

    if (!bcrypt.compareSync(oldPass, user.password)) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Incorrect password!'
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync(newPass, salt)

    await req.db.User.updateOne({ email: user.email }, { password })

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Password updated!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.editUser = async (req, res) => {
  try {
    await req.db.User.updateOne({ email: req.user.email }, req.body)

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'User updated!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.changeProfilePhoto = async (req, res) => {
  try {
    const extension = '.' + req.file.originalname.split('.')[1]
    const key = req.user.firstName + req.user.lastName + extension

    const params = {
      Bucket: req.config.AWS_BUCKET,
      Key: key,
      Body: req.file.buffer
    }

    await req.s3.upload(params, (err, data) => {
      if(err) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Unable to upload file!'
        })
      }
    })

    await req.db.User.updateOne({ email: req.user.email }, { profilePhoto: key })

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Profile photo updated!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}