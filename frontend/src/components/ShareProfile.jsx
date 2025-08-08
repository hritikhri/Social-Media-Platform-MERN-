import React from "react";

const ShareProfile = ({ name = "Unknown", username = "", profilePicture, onClose, defaultPic }) => {
  const handleCopy = () => {
    if (username) {
      navigator.clipboard.writeText(`http://localhost:5173/${username}`);
      // alert("Profile link copied!");
      const click = document.getElementById("CopyBtn")
      click.innerHTML="Copied ✅"
      // click.style.backgroundColor="#65#587ea7ff"
    } else {
      alert("Invalid profile link");
    }
  };

  return (
    <div className="ShareProfile">
      <div className="ShareUrl">
        <div className="profilePic">
          <img
            src={profilePicture ? `http://localhost:5000/images/${profilePicture}` : defaultPic}
            alt="Profile"
            className="profile-pic-large"
          />
        </div>
        <div className="Profilename">{name}</div>
        <div className="url">{username ? `http://localhost:5173/${username}` : "No URL available"}</div>
        <footer>
          <button id="CopyBtn" onClick={handleCopy} style={{backgroundColor:"#007bff"}} >Copy</button>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default ShareProfile;
