const HttpStatus = require('http-status-codes')
const { 
  mongo: { 
    ObjectId 
  } 
} = require('mongoose')

exports.getNotifications = async (req, res) => {
  try {
    console.log(req.user._id)
    const notifications = await req.db.Notification.find({ 
      targetId: ObjectId(req.user._id) 
    })

    return res.status(HttpStatus.OK).json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}