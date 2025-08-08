const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('followers', 'username name profilePicture')
      .populate('following', 'username name profilePicture');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      bio:user.bio,
      notes: "hey their today is the best day , ever ever ever",
      // user.notes
      location:user.location,
    });
  } catch (err) {
    console.error('Get Profile Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username name profilePicture')
      .populate('following', 'username name profilePicture');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    const currentUser = await User.findById(req.user.id);
    res.json({
      id: user._id,
      username: user.username,
      name: user.name,
      email:user.email,
      bio:user.bio,
      profilePicture: user.profilePicture,
      followers: user.followers,
      following: user.following,
      notes: user.notes,
      isFollowing: currentUser.following.includes(user._id),
      isCurrentUser: user._id.toString() === req.user.id
    });
  } catch (err) {
    console.error('Get User by Username Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { username, name, email ,bio ,notes } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (username) user.username = username;
    if (name) user.name = name;
    if (email) user.email = email;
    if(bio) user.bio = bio;
    if(notes) user.notes = notes;
    if (req.file) user.profilePicture = req.file.filename;

    await user.save();
    const updatedUser = await User.findById(req.user.id)
      .select('-password')
      .populate('followers', 'username name profilePicture')
      .populate('following', 'username name profilePicture');
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
      bio:updatedUser.bio,
      notes:updatedUser.notes,
      profilePicture: updatedUser.profilePicture,
      followers: updatedUser.followers,
      following: updatedUser.following
    });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};