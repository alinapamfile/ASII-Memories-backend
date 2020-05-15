const HttpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { getToken } = require('../utils/getToken')

exports.checkAuth = async (req, res, next) => {
  try {
    const token = getToken(req)

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'You must have an authorization token'
      })
    }

    jwt.verify(token, req.config.JWT_KEY, (err, data) => {
      if (err) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          err
        })
      }

      req.user = data
    })
    
    next()
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}