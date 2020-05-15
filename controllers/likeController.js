const HttpStatus = require('http-status-codes')
const { 
  mongo: { 
    ObjectId 
  } 
} = require('mongoose') 

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user._id

    const post = await req.db.Post.findOne({ _id: ObjectId(postId) })
    const likes = post.likes

    if (likes.includes(ObjectId(userId))) {
      const index = likes.indexOf(ObjectId(userId))
      likes.splice(index, 1)
    } else {
      likes.push(ObjectId(userId))
      await req.db.Notification.create({
        targetId: post.userId,
        actionerId: req.user._id,
        postId: post._id,
        type: 'like'
      })
    }

    await req.db.Post.updateOne(
      { _id: ObjectId(postId) }, 
      { likes }
    )

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

exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user._id

    const comment = await req.db.Comment.findOne({ _id: ObjectId(commentId) })
    const likes = comment.likes

    if (likes.includes(ObjectId(userId))) {
      const index = likes.indexOf(ObjectId(userId))
      likes.splice(index, 1)
    } else {
      likes.push(ObjectId(userId))
    }

    await req.db.Comment.updateOne(
      { _id: ObjectId(commentId) }, 
      { likes }
    )

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