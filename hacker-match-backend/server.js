const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://yujy959:Up665PgiWzFdSFPf@cluster0.kkjpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Could not connect to MongoDB:', error));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['frontend', 'backend'] }, // Ensures role is either 'frontend' or 'backend'
});

const User = mongoose.model('User', userSchema);

// Route to add a user
app.post('/users', async (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required' });
  }

  try {
    const newUser = new User({ name, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
});

// Route to get a match for a user based on complementary role
app.get('/match/:role', async (req, res) => {
  const { role } = req.params;

  if (role !== 'frontend' && role !== 'backend') {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const complementaryRole = role === 'frontend' ? 'backend' : 'frontend';

  try {
    const match = await User.findOne({ role: complementaryRole });

    if (!match) {
      return res.status(404).json({ message: 'No match found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error finding match', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});