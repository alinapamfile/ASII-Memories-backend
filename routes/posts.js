const router = require('express').Router()
const { postController, likeController } = require('../controllers')
const comments = require('./comments.js')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})

router.post('/', upload.single('file'), postController.post)
router.patch('/:postId', postController.editPost)
router.delete('/:postId', postController.deletePost)
router.get('/:postId', postController.getPost)
router.get('/', postController.getNewPosts)
router.get('/:postId/file', postController.getFile)

router.patch('/:postId/like', likeController.likePost)

router.use('/:postId/comments', comments)

module.exports = router