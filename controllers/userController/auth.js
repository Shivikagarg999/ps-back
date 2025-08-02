const User = require('../../models/user/user');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { phone, name, email } = req.body;

  try {
    let existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ error: 'Phone already registered' });

    const newUser = new User({ phone, name, email });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};
