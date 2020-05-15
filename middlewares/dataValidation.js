const HttpStatus = require('http-status-codes')

exports.dataValidation = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body)
    next()
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}