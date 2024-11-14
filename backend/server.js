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

// Define manager schema and model
const managerSchema = new mongoose.Schema({
  username: String,
  group_limit: Number
});
const Manager = mongoose.model('Manager', managerSchema, 'managers');

// Define group schema and model
const groupSchema = new mongoose.Schema({
  group_id: String, // New field
  group_name: String,
  members: [String],
  manager: String,
  budget: Number
});
const Group = mongoose.model('Group', groupSchema, 'groups');

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String, // New field
  password: String,
  tag: String
});
const User = mongoose.model('User', userSchema, 'users');

// API endpoint to get all managers (for admin dashboard)
app.get('/api/managers', async (req, res) => {
  try {
    const managers = await Manager.find({}, 'username group_limit');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers' });
  }
});

// API endpoint to get all groups (for manager dashboard)
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await Group.find({}, 'group_id group_name members manager budget'); // Include group_id
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// API endpoint to get all users with tag "user" (for delete user dropdown)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ tag: "user" }, 'username email'); // Include email in the response
    res.json(users.map(user => ({ username: user.username, email: user.email }))); // Return both username and email
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
