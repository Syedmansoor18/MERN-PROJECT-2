// server.cjs (Save this file with a .cjs extension)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Required for cross-origin requests from your React app

const app = express();
const PORT = process.env.PORT || 5000; // Server will run on port 5000

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all origins (adjust for production)

// MongoDB Connection URI - REPLACE WITH YOUR MONGODB ATLAS CONNECTION STRING
// Example: mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
const MONGODB_URI = 'mongodb://localhost:27017/studentDB';
const JWT_SECRET = 'YOUR_SUPER_SECRET_JWT_KEY'; // Replace with a strong, random secret key

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- User Model ---
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

// --- API Routes ---

// Register User (Signup)
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    user = new User({ email, password });
    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully!', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during signup.');
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Logged in successfully!', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during login.');
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
To run this backend:
1. Make sure you have Node.js installed.
2. Create a new directory for your backend (e.g., `backend`).
3. Save this code as `server.cjs` inside that directory.
4. Open your terminal, navigate to the `backend` directory.
5. Initialize a Node.js project: `npm init -y`
6. Install required packages: `npm install express mongoose bcryptjs jsonwebtoken cors`
7. Replace 'YOUR_MONGODB_ATLAS_CONNECTION_STRING' with your actual connection string from MongoDB Atlas.
8. Replace 'YOUR_SUPER_SECRET_JWT_KEY' with a strong, unique secret key.
9. Start the server: `node server.cjs`
*/
