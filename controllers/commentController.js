const HttpStatus = require('http-status-codes')
const { 
  mongo: { 
    ObjectId 
  } 
} = require('mongoose') 

exports.postCommment = async (req, res) => {
  try {
    const postId = req.baseUrl.split('/')[2]
    const userId = req.user._id
    const comment = req.body.comment

    await req.db.Comment.create({
      postId: ObjectId(postId),
      userId: ObjectId(userId),
      comment
    })

    const post = await req.db.Post.findOne({ _id: ObjectId(postId) })

    await req.db.Notification.create({
      targetId: post.userId,
      actionerId: req.user._id,
      postId: post._id,
      type: 'comment'
    })
    
    return res.json({
      success: true,
      message: 'Comment added successfuly!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const comment = await req.db.Comment.findOne({ _id: ObjectId(commentId)})

    if (!comment) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Comment not found!'
      })
    }

    await req.db.Comment.deleteOne({ _id: ObjectId(commentId)})

    return res.json({
      success: true,
      message: 'Comment deleted successfuly!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const comment = await req.db.Comment.findOne({ _id: ObjectId(commentId)})

    if (!comment) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Comment not found!'
      })
    }

    await req.db.Comment.updateOne(
      { _id: ObjectId(commentId) }, 
      { comment: req.body.comment }
    )

    return res.json({
      success: true,
      message: 'Comment edited successfuly!'
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}

exports.getComments = async (req, res) => {
  try {
    const postId = req.baseUrl.split('/')[2]
    const comments = await req.db.Comment.find({ postId: ObjectId(postId) })

    return res.status(HttpStatus.OK).json({
      success: true,
      comments
    })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something bad happened!'
    })
  }
}