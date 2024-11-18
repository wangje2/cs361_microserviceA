const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import the JournalEntry schema
const JournalEntry = require('./schema/MoodEntry'); // adjust file path as needed

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Create a new journal entry
app.post('/entries', async (req, res) => {
  try {
    const { mood, thoughts } = req.body;
    const newEntry = new JournalEntry({ mood, thoughts });
    await newEntry.save();
    console.log("POST /entries: New entry created.");
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("POST /entries: Failed to create entry.");
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Retrieve all journal entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await JournalEntry.find().sort({ date: -1 });
    console.log("GET /entries: All entries retrieved.");
    res.json(entries);
  } catch (error) {
    console.error("GET /entries: Failed to retrieve entries.");
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// Update a journal entry by ID
app.put('/entries/:id', async (req, res) => {
  try {
    const { mood, thoughts } = req.body;
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      { mood, thoughts },
      { new: true }
    );
    if (!updatedEntry) {
      console.log(`PUT /entries/${req.params.id}: Entry not found.`);
      return res.status(404).json({ error: 'Entry not found' });
    }
    console.log(`PUT /entries/${req.params.id}: Entry updated.`);
    res.json(updatedEntry);
  } catch (error) {
    console.error(`PUT /entries/${req.params.id}: Failed to update entry.`);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete a journal entry by ID
app.delete('/entries/:id', async (req, res) => {
  try {
    const deletedEntry = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      console.log(`DELETE /entries/${req.params.id}: Entry not found.`);
      return res.status(404).json({ error: 'Entry not found' });
    }
    console.log(`DELETE /entries/${req.params.id}: Entry deleted.`);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(`DELETE /entries/${req.params.id}: Failed to delete entry.`);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
