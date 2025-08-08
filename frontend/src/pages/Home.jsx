import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import AlertPop from "../components/AlertPop";
import { UseList } from "../components/UseList";

const Home = () => {
  const [userList, setuserList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [Alert, setAlert] = useState(false);
  const [defaultPic, setdefaultPic] = useState(
    "http://localhost:5000/images/1122.png"
  );
  const [user, setUser] = useState({
    username: "",
    profilePicture: "" || "http://localhost:5000/images/1122.png",
    location: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        const [postsRes, profileRes, allUserList] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/posts`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/auth/userlist`, config),
        ]);
        setPosts(postsRes.data);
        setUser({
          name: profileRes.data.name,
          username: profileRes.data.username,
          profilePicture: profileRes.data.profilePicture,
          location: profileRes.data.location || {},
        });
        setuserList(allUserList.data);
        // console.log(allUserList.data);
      } catch (err) {
        console.error(
          "Home Fetch Error:",
          err.response?.data?.msg || err.message
        );
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        { content },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setContent("");
      setAlert(true);
      fetchPosts();
    } catch (err) {
      console.error(
        "Post Submit Error:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(
        "Fetch Posts Error:",
        err.response?.data?.msg || err.message
      );
    }
  };

  return (
    <div className="HomePageMainCon">
      <div className={`home-page body`}>
        {Alert && (
          <AlertPop
            message="Post is created ✔"
            onClose={() => setAlert(false)}
          />
        )}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="user-info">
            <img
              src={
                user.profilePicture
                  ? `http://localhost:5000/images/${user.profilePicture}`
                  : defaultPic
              }
              alt="Profile"
              className="user-profile-pic"
            />
            <div>
              <span className="user-username">@{user.name}</span>
              <small className="user-location">
                {user.location.city && user.location.country
                  ? `${user.location.city}, ${user.location.country}`
                  : "Location unknown"}
              </small>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
          />
          <button type="submit">Post</button>
        </form>
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>
      </div>
      <div className="allUserListCon">
        <UseList userList={userList} defaultPic={defaultPic} user={user} />
        {/* <div className="allUserList">
          <header>
            <h1>You may know them !</h1>
            <hr />
          </header>
          <section>
            <div className="UserDataInfo">
              {userList.map((user) => {
                return (
                  <div key={user._id} className="UserData"> 
                    <div className="Userimg">
                      <img
                          src={
                            user.profilePicture
                            ? `http://localhost:5000/images/${user.profilePicture}`
                            : defaultPic
                          }
                          alt="Profile"
                          className="ListPic"
                          />
                    </div>
                    <Link className="Username-friendBox" to={`/${user.username}`}>
                    <h2>{user.username}</h2>
                    </Link>
                    <Link className="SeeLink" to={`/${user.username}`} >See</Link>
                  </div>
                );
              })}
            </div>
          </section>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
