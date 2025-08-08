import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [defaultPic ,setDefaultPic] = useState("http://localhost:5000/images/1122.png");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/notifications/read`, {}, {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notification-container">
      <button onClick={() => setShow(!show)} className={`notification-btn`}>
        Notifications ({notifications.filter(n => !n.read).length})
      </button>
      {show && (
        <div className={`notification-dropdown `}>
          {notifications.map(n => (
            <div key={n._id} className={`notification-item ${n.read ? '' : 'unread'}`}>
              <span onClick={() => navigate(`/${n.sender.username}`)}>
                { <img src= { n.sender.profilePicture? `http://localhost:5000/images/${n.sender.profilePicture} ` : defaultPic} alt="" /> }
                {n.sender.name} {n.type}d your post
              </span>
            </div>
          ))}
          <button onClick={markAsRead} className="read-btn">Mark as Read</button>
        </div>
      )}
    </div>
  );
};

export default Notification;