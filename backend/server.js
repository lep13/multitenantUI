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
  group_id: String,
  group_name: String,
  members: [String],
  manager: String,
  budget: Number
});
const Group = mongoose.model('Group', groupSchema, 'groups');

// service schema and model
const serviceSchema = new mongoose.Schema({
  username: String,
  provider: String,
  service: String,
  status: String,
  estimated_cost: Number,
  timestamp: Date,
  groupname: String,
  group_budget: Number,
  group_id: String,
  service_status: String,
});

const Service = mongoose.model('Service', serviceSchema, 'services');

// API endpoint to get the group of a user by username (will return manager name as well + members array)
app.get('/api/user-group', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Query the groups collection to find the group for the given username
    const group = await Group.findOne({ members: username }, 'group_id manager members'); // Include `members`
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Return group ID, manager, and members
    res.json({ group_id: group.group_id, manager: group.manager, members: group.members });
  } catch (error) {
    console.error('Error fetching user group:', error);
    res.status(500).json({ message: 'Error fetching user group' });
  }
});

// API endpoint to get all services for a specific group
app.get('/api/services', async (req, res) => {
  const { group_id } = req.query;

  if (!group_id) {
    return res.status(400).json({ message: 'Group ID is required' });
  }

  try {
    // Query services based on the group ID
    const services = await Service.find(
      { group_id },
      'username provider service status estimated_cost timestamp service_status'
    );

    const formattedServices = services.map((service) => ({
      username: service.username,
      provider: service.provider,
      service: service.service,
      status: service.service_status,
      estimated_cost: service.estimated_cost,
      date_created: service.timestamp.toISOString().split('T')[0],
    }));
    res.json(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services' });
  }
});
 
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
    const groups = await Group.find({}, 'group_name members manager budget');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});
 
 
// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  tag: String // Changed from "Tag" to "tag"
});
const User = mongoose.model('User', userSchema, 'users');
 
// API endpoint to get all users with tag "user" (for delete user dropdown)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ tag: "user" }, 'username'); // Changed from "Tag" to "tag"
    res.json(users.map(user => user.username));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// API endpoint to get tag and email by username
app.get('/api/user', async (req, res) => {
  const { username } = req.query; // Read username from query parameters
  try {
    const user = await User.findOne({ username }, 'tag email'); // Fetch tag and email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ tag: user.tag, email: user.email });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});