const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('sender', 'username name profilePicture')
      .populate('post', 'content user')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Get Notifications Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ msg: 'Notifications marked as read' });
  } catch (err) {
    console.error('Mark Notifications Read Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};