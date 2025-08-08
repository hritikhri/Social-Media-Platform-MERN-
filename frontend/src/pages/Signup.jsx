import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mess,setMess]= useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('location', JSON.stringify(res.data.location)); // Store location
      navigate('/');
    } catch (err) {
      console.error('Signup Error:', err.response?.data?.msg || err.message);
      setMess(err.response.data.msg || 'Signup failed');
    }
  };

  return (
    <div className={`auth-page `}>
      <div className="logo-Img"></div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Signup</h2>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {/* <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} accept="image/*" /> */}
        <div className="mess">
          {mess}
        </div>
        <button type="submit">Signup</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
};

export default Signup;