// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();






// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to JSON file
const DATA_FILE = path.join(__dirname, 'data', 'developers.json');

// Ensure data directory and file exist
async function initializeDataFile() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        try {
            await fs.access(DATA_FILE);
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
        }
    } catch (error) {
        console.error('Error initializing data file:', error);
    }
}

// Initialize data file on server start
initializeDataFile();

// API Endpoints
app.post('/api/developers', async (req, res) => {
    try {
        const newDeveloper = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        const fileData = await fs.readFile(DATA_FILE, 'utf8');
        const developers = JSON.parse(fileData);
        developers.push(newDeveloper);
        
        await fs.writeFile(DATA_FILE, JSON.stringify(developers, null, 2));
        res.status(201).json(newDeveloper);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/developers', async (req, res) => {
    try {
        const fileData = await fs.readFile(DATA_FILE, 'utf8');
        const developers = JSON.parse(fileData);
        res.json(developers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});