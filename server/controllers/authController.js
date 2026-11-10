const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign JWT tokens
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Enforce business rule: only customer accounts can be created via registration
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: 'customer',
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login customer or admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ message: 'Server error fetching profile' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};

