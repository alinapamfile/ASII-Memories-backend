const HttpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const sgdMail = require('@sendgrid/mail')
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
  try {
    const existingUser = await req.db.User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: 'User already exists!'
      })
    }

    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)

    const user = await req.db.User.create(req.body)
        
    delete user._doc.password

    const token = jwt.sign(user._doc, req.config.JWT_KEY, { expiresIn: '7d' })
    
    const link = 'http://localhost:8000/confirm?token=' + token
    sgdMail.setApiKey(req.config.SENDGRID_API_KEY)

    const msg = {
      to: user.email,
      from: { name: 'ASII Memories', email: 'asiimemories@gmail.com' },
      templateId: req.config.SENDGRID_EMAIL_CONFIRMATION,
      dynamic_template_data: { link }
    }
            
    sgdMail.send(msg)

    return res.status(HttpStatus.OK).json({
      success: true,
      token
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.login = async (req, res) => {
  try {
    const user = await req.db.User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'User not found!'
      })
    }

    if (user.confirmed === false) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Email address is not confirmed!'
      })
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Incorrect password!'
      })
    }

    delete user._doc.password

    const token = jwt.sign(user._doc, req.config.JWT_KEY, { expiresIn: '7d' })

    return res.status(HttpStatus.OK).json({
      success: true,
      token
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.confirm = async (req, res) => {
  try {
    const { token } = req.body
    const userData = jwt.verify(token, req.config.JWT_KEY)

    const user = await req.db.User.findOne({ email: userData.email })

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'User not found!'
      })
    }

    if (user.confirmed === true) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email already confirmed!"
      })
    }

    await req.db.User.updateOne({ email: user.email }, { confirmed: true })
    
    return res.status(HttpStatus.OK).json({
      success: true
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    let user = await req.db.User.findOne({ email })

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'User not found!'
      })
    }

    user = await req.db.User.findOneAndUpdate(
      { email },
      { passwordResetFlag: true },
      { new: true }
    )

    delete user._doc.password
    const token = jwt.sign(user._doc, req.config.JWT_KEY, { expiresIn: '1d' })
    
    const link = 'http://localhost:8000/resetpassword?token=' + token
    sgdMail.setApiKey(req.config.SENDGRID_API_KEY)

    const msg = {
      to: email,
      from: { name: 'ASII Memories', email: 'asiimemories@gmail.com' },
      templateId: req.config.SENDGRID_PASSWORD_RESET,
      dynamic_template_data: { link }
    }
            
    sgdMail.send(msg)

    return res.status(HttpStatus.OK).json({
      success: true,
      token
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { newPass, token } = req.body

    const userData = jwt.verify(token, req.config.JWT_KEY)
    const user = await req.db.User.findOne({ email: userData.email })

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "User not found!"
      })
    }

    if (user.passwordResetFlag === false) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Can\'t change password!'
      })
    }

    if (bcrypt.compareSync(newPass, user.password)) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Your new password must be different from the old one!'
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const encryptedPass = bcrypt.hashSync(newPass, salt)

    await req.db.User.updateOne(
      { email: user.email }, 
      { password: encryptedPass, 
        passwordResetFlag: false }
    )

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