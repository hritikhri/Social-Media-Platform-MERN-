const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const postController = require('../controllers/postController');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.get('/user/:userId', authMiddleware, postController.getUserPosts);
router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/dislike', authMiddleware, postController.dislikePost);
router.post('/:id/comment', authMiddleware, postController.commentPost);
router.put('/:id', authMiddleware, postController.editPost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;