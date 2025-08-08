const Notification = require("../models/Notification");
const User = require("../models/User");

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToFollow || !currentUser)
      return res.status(404).json({ msg: "User not found" });
    if (req.user.id === req.params.id)
      return res.status(400).json({ msg: "Cannot follow yourself" });

    const isFollowing = currentUser.following.includes(req.params.id);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
    }
    await currentUser.save();
    await userToFollow.save();

    const updatedUser = await User.findById(req.params.id)
      .select("-password -email")
      .populate("followers", "username name profilePicture")
      .populate("following", "username name profilePicture");
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      name: updatedUser.name,
      profilePicture: updatedUser.profilePicture,
      followers: updatedUser.followers,
      following: updatedUser.following,
      isFollowing: !isFollowing,
    });
  } catch (err) {
    console.error("Follow User Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("username name profilePicture")
      .limit(10);
    res.json(users);
  } catch (err) {
    console.error("Search Users Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.UserList = async (req, res) => {
  try {
    const userList = await User.find({}).select("username name profilePicture").limit(8);
    // console.log(userList)
    res.status(200).json(userList)
  } catch (err) {
    console.log("error in fetching userList", err);
    res.status(500).json({ msg: "Server errpr", error: err.message });
  }
};
