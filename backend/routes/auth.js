const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const authOperations = require('../controllers/authOperations');
const profileManagement = require('../controllers/profileManagement');
const userRelationships = require('../controllers/userRelationships');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/signup', upload.single('profilePicture'), authOperations.signup);
router.post('/login', authOperations.login);
router.get('/profile', authMiddleware, profileManagement.getProfile);
router.get('/user/username/:username', authMiddleware, profileManagement.getUserByUsername);
router.put('/profile', authMiddleware, upload.single('profilePicture'), profileManagement.updateProfile);
router.post('/user/:id/follow', authMiddleware, userRelationships.followUser);
router.get('/search', authMiddleware, userRelationships.searchUsers);
router.get("/userlist",authMiddleware,userRelationships.UserList)

module.exports = router;