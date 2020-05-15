const HttpStatus = require('http-status-codes')
const awsCloudFront = require('aws-cloudfront-sign')
const { 
  mongo: { 
    ObjectId 
  } 
} = require('mongoose')

exports.post = async (req, res) => {
  try {
    const extension = '.' + req.file.originalname.split('.')[1]

    const post = await req.db.Post.create({
      userId: req.user._id,
      description: req.body.description,
      extension
    })

    const key = post._id + extension
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

    return res.json({
      success: true,
      message: 'The file was uploaded!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.editPost = async (req, res) => {
  try {
    const { postId } = req.params

    await req.db.Post.updateOne(
      { _id: ObjectId(postId) }, 
      { description: req.body.description }
    )

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Post updated!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await req.db.Post.findOne({ _id: ObjectId(postId) })

    if(!post) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Post not found!'
      })
    }
      
    const key = postId + post.extension
    const params = {
      Bucket: req.config.AWS_BUCKET,
      Key: key
    }

    await req.db.Post.deleteOne({ _id: ObjectId(postId) })

    await req.s3.deleteObject(params, (err, data) => {
      if (err) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Unable to delete post!'
        })
      }
    })

    return res.json({
      success: true,
      message: 'The post has been deleted!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await req.db.Post.findOne({ _id: ObjectId(postId) })

    return res.status(HttpStatus.OK).json({
      success: true,
      post
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.getNewPosts = async (req, res) => {
  try {
    const posts = await req.db.Post
      .find()
      .sort({ $natural:1 })
      .limit(50);

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

exports.getFile = async (req, res) => {
  try {
    const { postId } = req.params
    const post = req.db.Post.findOne({ _id: ObjectId(postId) })

    const options = {
      keypairId: req.config.CLOUDFRONT_KEYPAIR_ID,
      privateKeyPath: req.config.CLOUDFRONT_PRIVATEKEY_PATH
    }

    const cloudFrontUrl = req.config.CLOUDFRONT_URL + '/' + post._id + post.extension
    const fileUrl = awsCloudFront.getSignedUrl(cloudFrontUrl, options)

    return res.status(HttpStatus.OK).json({
      success: true,
      fileUrl
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}