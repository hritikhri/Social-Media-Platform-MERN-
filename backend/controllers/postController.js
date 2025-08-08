const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
  const { content, image } = req.body;
  try {
    const post = new Post({ user: req.user.id, content, image });
    await post.save();
    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username name profilePicture"
    );
    res.json(populatedPost);
  } catch (err) {
    console.error("Create Post Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username name profilePicture")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username name profilePicture")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Get User Posts Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.likes.push(req.user.id);
      if (post.user.toString() !== req.user.id) {
        await new Notification({
          user: post.user,
          type: "like",
          sender: req.user.id,
          post: post._id,
        }).save();
      }
    } else {
      post.likes.pop(req.user.id);
    }
    await post.save();
    const updatedPost = await Post.findById(post._id).populate(
      "user",
      "username name profilePicture"
    );
    res.json(updatedPost);
  } catch (err) {
    console.error("Like Post Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.json({ mess: "Post does not exist" });
    }
    const userIndex = post.dislike.indexOf(req.user.id);
    if (userIndex === -1) {
      await post.dislike.push(req.user.id);
    } else {
      post.dislike.pop(req.user.id);
    }
    if (post.user.toString() !== req.user.id) {
      await new Notification({
        user: post.user,
        type: "dislike",
        sender: req.user.id,
        post: post._id,
      }).save();
    }
    await post.save();
    const updatedPost = await Post.findById(post._id).populate(
      "user",
      "username name profilePicture"
    );
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
  }
};

exports.commentPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();
    if (post.user.toString() !== req.user.id) {
      await new Notification({
        user: post.user,
        type: "comment",
        sender: req.user.id,
        post: post._id,
      }).save();
    }
    const updatedPost = await Post.findById(post._id)
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username name profilePicture");
    res.json(updatedPost);
  } catch (err) {
    console.error("Comment Post Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.editPost = async (req, res) => {
  const { content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });
    post.content = content;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Edit Post Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await post.deleteOne();
    res.json({ msg: "Post deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username name profilePicture");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Get Post By ID Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
