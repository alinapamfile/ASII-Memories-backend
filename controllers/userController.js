const HttpStatus = require('http-status-codes')
const awsCloudFront = require('aws-cloudfront-sign')
const { 
  mongo: { 
    ObjectId 
  } 
} = require('mongoose')

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await req.db.User.findOne({ _id: ObjectId(userId) })

    delete user._doc.password

    const options = {
      keypairId: req.config.CLOUDFRONT_KEYPAIR_ID,
      privateKeyPath: req.config.CLOUDFRONT_PRIVATEKEY_PATH
    }

    if (user.profilePhoto !== null) {
      const cloudFrontUrl = req.config.CLOUDFRONT_URL + '/' + user.profilePhoto
      user.profilePhoto = awsCloudFront.getSignedUrl(cloudFrontUrl, options)
    }
    
    return res.status(HttpStatus.OK).json({
      success: true,
      user
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await req.db.Post.find({ userId: ObjectId(userId) })

    return res.status(HttpStatus.OK).json({
      success: true,
      posts
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.getUsersMatching = async (req, res) => {
  try {
    const { name } = req.params
    const users = await req.db.User.find({ $or: [
      { firstName: { $regex: name, $options: 'si' } },
      { lastName: { $regex: name, $options: 'si' } }
    ]})

    return res.status(HttpStatus.OK).json({
      success: true,
      users
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}