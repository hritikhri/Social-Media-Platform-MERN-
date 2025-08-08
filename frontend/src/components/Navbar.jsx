import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "./Notification";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [defaultPic, setdefaultPic] = useState('http://localhost:5000/images/1122.png');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [Read,setRead] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/profile`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setProfilePic(res.data.profilePicture);
        setUsername(res.data.username);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/search?query=${searchQuery}`,
            {
              headers: { "x-auth-token": localStorage.getItem("token") },
            }
          );
          setSearchResults(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    };
    searchUsers();
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className={`navbar body`}>
      <div className="homebtn">
        <Link to="/" className="nav-link">
          <div className="nav-logo"></div>
        </Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        {searchResults.length > 0 && (
          <ul className="search-results body">
            {searchResults.map((user) => (
              <li
                key={user._id}
                onClick={() => {
                  navigate(`/${user.username}`);
                  setSearchQuery("");
                }}
              >
                  <img src={ user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : defaultPic }
                  alt="Profile" className="search-pic" />
                {user.name} (@{user.username})
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="navMainBtns">
        <div className="navProfile">
          {username && (
            <Link to={`/${username}`} className="nav-link">
              {
                <img
                  src={
                    ProfilePic
                      ? `http://localhost:5000/images/${ProfilePic}`
                      : defaultPic
                  }
                  alt=""
                />
              }
            </Link>
          )}
        </div>
        <div className="nofication" onClick={()=>{setRead(true)}}>
          <Notification />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
