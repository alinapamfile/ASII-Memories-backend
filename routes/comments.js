const router = require('express').Router()
const { commentController, likeController } = require('../controllers')

router.post('/', commentController.postCommment)
router.get('/', commentController.getComments)
router.delete('/:commentId', commentController.deleteComment)
router.patch('/:commentId', commentController.editComment)

router.patch('/:commentId/like', likeController.likeComment)

module.exports = router