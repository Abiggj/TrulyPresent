const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const port = 7000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/attendance');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema for your data
const responseSchema = new mongoose.Schema({
  username: String,
  date: String,
  apiResponse: [String], // Change this to an array of strings
});

const Response = mongoose.model('Response', responseSchema);

app.use(bodyParser.json());

// Endpoint to store the data
app.post('/storeResponse', async (req, res) => {
  try {
    const { username, date, apiResponse } = req.body;
    
    // Save the data to MongoDB
    const response = new Response({ username, date, apiResponse });
    await response.save();

    const path = '/home/abiggj/Projects/Web/truly-present/attendanceFiles/';

    // Check if the directory exists, create it if not
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    const csvWriter = createCsvWriter({
      path: `${path}response_${date}.csv`,
      header: [
        { id: 'username', title: 'Username' },
        { id: 'date', title: 'Date' },
        { id: 'apiResponse', title: 'ApiResponse' },
      ],
    });

    await csvWriter.writeRecords([{ username, date, apiResponse }]);


    res.status(201).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, '192.168.160.121', () => {
  console.log(`Server is running on port ${port}`);
});
