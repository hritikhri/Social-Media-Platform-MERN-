import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import UserListPopup from "../components/UserListPopup";
import Loading from "../components/Loading";
import ShareProfile from "../components/ShareProfile";
import { Notes } from "../components/Notes";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [notes, setNotes] = useState("");
  const [SharePopup, setSharePopup] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [defaultPic, setdefaultPic] = useState(
    "http://localhost:5000/images/1122.png"
  );
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();
  const { username: urlUsername } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { "x-auth-token": localStorage.getItem("token") },
        };
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/user/username/${urlUsername}`,
          config
        );
        const postsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/user/${profileRes.data.id}`,
          config
        );
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        setUsername(profileRes.data.username);
        setName(profileRes.data.name);
        setEmail(profileRes.data.email || "");
        setBio(profileRes.data.bio || "");
        setNotes(profileRes.data.notes);
      } catch (err) {
        console.error("Profile Fetch Error:", err.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchData();
  }, [urlUsername, navigate]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/${profile.id}/follow`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setProfile(res.data);
    } catch (err) {
      console.error("Follow Error:", err.message);
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile(res.data);
      setEditMode(false);
      navigate(`/${res.data.username}`);
    } catch (err) {
      console.error("Edit Profile Error:", err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/user/${profile.id}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch Posts Error:", err.message);
    }
  };

  if (!profile) return <div className={`loading`}>Loading...</div>;

  return (
    <Suspense
      fallback={
        <div className="Loading">
          <Loading />
        </div>
      }
    >
      <>
        <div className={`profile-page`}>
          <h2>
            {profile.isCurrentUser ? "" : `${profile.username}'s Profile`}
          </h2>
          {editMode && profile.isCurrentUser ? (
            <div className="edit-profile">
              <p>Edit Profile -</p>
              <form>
                <header>
                  <div className="editPlacesDefault">
                    <div className="profileDpPic">
                      <img
                      src={
                        profile.profilePicture
                          ? `http://localhost:5000/images/${profile.profilePicture}`
                          : defaultPic
                      }
                      alt="Profile"
                      className="profile-pic-large"
                    />
                    </div>
                    {/* <div className="names">Profile</div> */}
                  </div>
                  <div className="editPlaces">
                    <div className="names">Name:</div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="editPlaces">
                    <div className="names">Username:</div>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </div>
                  <div className="editPlaces">
                    <div className="names">Email:</div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  <div className="editPlaces">
                    <div className="names">Profile Pic :</div>
                    <input
                      type="file"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                      accept="image/*"
                    />
                  </div>
                  <div className="editPlaces">
                    <div className="names">Bio :</div>
                    <textarea
                      value={bio}
                      rows={5}
                      onChange={(e) => {
                        setBio(e.target.value);
                      }}
                      placeholder="Edit bio..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    onClick={handleEdit}
                    className="save-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </header>
              </form>
            </div>
          ) : (
            <div className="profile-info">
              <div className="profile-info-dd">
                <div className="Notes-main">
                  {/* <Notes notes={notes || "Unknown"} /> */}
                </div>
                <img
                  src={
                    profile.profilePicture
                      ? `http://localhost:5000/images/${profile.profilePicture}`
                      : defaultPic
                  }
                  alt="Profile"
                  className="profile-pic-large"
                />
                <div className="rightProfile">
                  <h3>
                    {profile.name} (@{profile.username})
                  </h3>
                  {profile.isCurrentUser}
                  <div className="folowbtns">
                    <p>
                      <span
                        className="clickable"
                        onClick={() => setShowFollowers(!showFollowers)}
                      >
                        Followers: {profile.followers.length}
                      </span>
                    </p>
                    <p>
                      <span
                        className="clickable"
                        onClick={() => setShowFollowing(!showFollowing)}
                      >
                        Following: {profile.following.length}
                      </span>
                    </p>
                  </div>
                  <div className="profileBio">{bio}</div>
                  <div className="folowEdit-Btn">
                    {profile.isCurrentUser ? (
                      <div className="Sharebtn">
                        <button
                          onClick={() => setEditMode(true)}
                          className="edit-btn"
                        >
                          Edit Profile
                        </button>
                      </div>
                    ) : (
                      <div className="ShareBtns">
                        <button onClick={handleFollow} className="follow-btn">
                          {profile.isFollowing ? "Unfollow" : "Follow"}
                        </button>
                        <button
                          className="ShareBtn"
                          onClick={() => setSharePopup(true)}
                        >
                          Share Profile
                        </button>
                        {SharePopup && (
                          <ShareProfile
                            name={name || "Unknown"}
                            username={username || "NoUsername"}
                            profilePicture={profile.profilePicture}
                            defaultPic={defaultPic}
                            onClose={() => setSharePopup(false)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showFollowers && (
            <UserListPopup
              users={profile.followers}
              title="Followers"
              onClose={() => setShowFollowers(false)}
            />
          )}
          {showFollowing && (
            <UserListPopup
              users={profile.following}
              title="Following"
              onClose={() => setShowFollowing(false)}
              defaultPic={defaultPic}
            />
          )}
          {editMode ? (
            ""
          ) : (
            <div className="UserPostContainenr">
              <div className="postGrid">
                <div className="postGrid-main">
                  <div className="grid"></div>
                  <div className="grid"></div>
                  <div className="grid"></div>
                  <div className="grid"></div>
                </div>
              </div>
              <div className="posts">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Post key={post._id} post={post} onUpdate={fetchPosts} />
                  ))
                ) : (
                  <p id="NoPosts">No Post Shared</p>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    </Suspense>
  );
};

export default Profile;
