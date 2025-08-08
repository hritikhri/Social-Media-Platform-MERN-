import { useState } from "react";
import axios from "axios";
import { data, useNavigate, Link } from "react-router-dom";

const Post = ({ post, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [defaultPic, setdefaultPic] = useState(
    "http://localhost:5000/images/1122.png"
  );
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const formatTime = (date) => {
    const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const W_Day = new Date(date).getDay();
    const hours = new Date(date).getHours();
    const min = new Date(date).getMinutes();
    const AM_PM = () => {
      return hours >= 12 ? "PM" : "AM";
    };
    const Day = WeekDays[W_Day];
    const full_time = `${hours}:${min} ${Day}`;
    return full_time;
  };

  const handleLike = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/posts/${post._id}/like`,
      {},
      {
        headers: { "x-auth-token": localStorage.getItem("token") },
      }
    );
    onUpdate();
  };
  const handleDislike = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/posts/${post._id}/dislike`,
      {},
      {
        headers: { "x-auth-token": localStorage.getItem("token") },
      }
    );
    onUpdate();
  };
  const handleComment = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/posts/${post._id}/comment`,
      { text: commentText },
      {
        headers: { "x-auth-token": localStorage.getItem("token") },
      }
    );
    setCommentText("");
    onUpdate();
  };

  const handleEdit = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/posts/${post._id}`,
      { content },
      {
        headers: { "x-auth-token": localStorage.getItem("token") },
      }
    );
    setEditMode(false);
    onUpdate();
  };

  const handleDelete = async () => {
    setShowMenu(!showMenu);
    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    });
    onUpdate();
  };

  function handleMenuDrop() {
    const menu = document.getElementsByClassName("menu-btn");
  }

  return (
    <div className={`post body`} loading="lazy">
      {post.user._id === localStorage.getItem("userId") && (
        <div className="post-menu">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-btn">
            ⋯
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button
                onClick={() => {
                  setEditMode(true), setShowMenu(!showMenu);
                }}
              >
                Edit
              </button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
      {editMode ? (
        <div className="edit-form">
          <header>
            <div className="profile1-pic">
              <img
                src={
                  post.user.profilePicture
                    ? `http://localhost:5000/images/${post.user.profilePicture}`
                    : defaultPic
                }
                alt="Profile"
                className="profile-pic"
              />
              {post.user.name} (@{post.user.username})
            </div>
          </header>
          <textarea
            value={content}
            rows={5}
            onChange={(e) => setContent(e.target.value)}
            className="edit-textarea"
          />
          <button onClick={handleEdit} className="save-btn">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="post-header">
            <span
              className="username"
              onClick={() => navigate(`/${post.user.username}`)}
            >
              <img
                src={
                  post.user.profilePicture
                    ? `http://localhost:5000/images/${post.user.profilePicture}`
                    : defaultPic
                }
                alt="Profile"
                className="profile-pic"
              />
              {post.user.name} (@{post.user.username})
            </span>
            {/* <small className="postTime">{formatTime(post.createdAt)}</small> */}
          </div>
          <p className="PostContent">{post.content}</p>
          <div className="post-actions">
            <button onClick={handleLike} className="action-btn">
              Like ({post.likes.length})
            </button>
            <button className="action-btn dislike" onClick={handleDislike}>
              Disike ({post.dislike.length}){" "}
            </button>
            <small className="postTimeADMIN">{formatTime(post.createdAt)}</small>
          </div>

          <div className="comments">
            <div className="comi">
              {post.comments && post.comments.length > 0 ? 
              <h1>Comments :</h1>
              :""}
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-head">
                      <div className="commentUserinfo">
                        <img
                          src={
                            comment.user.profilePicture
                              ? `http://localhost:5000/images/${comment.user.profilePicture}`
                              : defaultPic
                          }
                          alt="Profile"
                          className=""
                        />
                        <Link to={`/${comment.user.username}`}>
                          {comment.user.username} -                        </Link>
                        {/* <span> </span> */}
                      </div>
                      <p>{comment.text}</p>
                      <small className="postTime">{formatTime(comment.createdAt)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              <div className="comment-form">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Comment..."
                  className="comment-input"
                />
                <button onClick={handleComment} className="comment-btn">
                  Comment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
