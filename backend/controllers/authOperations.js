const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Add axios for API calls

exports.signup = async (req, res) => {
  const { username, name, email, password } = req.body;
  try {
    const Username = await User.findOne({username});
    if (Username) return res.status(402).json({msg:"Username alredy taken"})
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists use another Email' });

    user = new User({
      username,
      name,
      email,
      password,
      profilePicture: req.file ? req.file.filename : ``
    });
    
    // Get IP geolocation data
    const ip = req.ip === '::1' ? '8.8.8.8' : req.ip; // Use a fallback IP for localhost testing
    // const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    // const geoData = geoResponse.data;
    // user.location = {
    //   country: geoData.country,
    //   countryCode: geoData.countryCode,
    //   city: geoData.city,
    //   lat: geoData.lat,
    //   lon: geoData.lon,
    //   isp: geoData.isp,
    //   ip: geoData.query
    // };

    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      userId: user._id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture,
      location: user.location
    });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Update location on login
    const ip = req.ip === '::1' ? '8.8.8.8' : req.ip; // Fallback for localhost
    // const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    // const geoData = geoResponse.data;
    // user.location = {
    //   country: geoData.country,
    //   countryCode: geoData.countryCode,
    //   city: geoData.city,
    //   lat: geoData.lat,
    //   lon: geoData.lon,
    //   isp: geoData.isp,
    //   ip: geoData.query
    // };
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      userId: user._id,
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture,
      location: user.location
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};