import { Link } from 'react-router-dom';

const UserListPopup = ({ users, title, onClose , defaultPic }) => {
  
  return (
    <div className={`popup body `}>
      <h3>{title}</h3>
      <ul className="user-list">
        {users.length> 0?(  
          users.map(user => (
            <li key={user._id}>
              <Link to={`/${user.username}`} onClick={onClose} className='popUser'>
                <img
                  src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : defaultPic }
                  alt="Profile"
                  className="user-pic"
                />
                {user.name} (@{user.username})
              </Link>
            </li>
          ))
        ):(
          <p className='noUserPop'>No Folowers</p>
        )}
      </ul>
      <button onClick={onClose} className="close-btn">Close</button>
    </div>
  );
};

export default UserListPopup;