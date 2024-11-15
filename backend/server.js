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
  service_status: String,
});

const Service = mongoose.model('Service', serviceSchema, 'services');

// API endpoint to get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find(
      {},
      'username provider service status estimated_cost timestamp service_status'
    );
    const formattedServices = services.map((service) => ({
      username: service.username,
      provider: service.provider,
      service: service.service,
      status: service.service_status, // Use `service_status` field for the status
      estimated_cost: service.estimated_cost,
      date_created: service.timestamp.toISOString().split('T')[0], // Extract date only
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
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});