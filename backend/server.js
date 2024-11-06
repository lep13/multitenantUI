require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // This will not be returned in the API response
  tag: String
});
const User = mongoose.model('User', userSchema, 'users'); // Third parameter specifies the collection name

// API endpoint to get all users (excluding passwords)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username tag'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
