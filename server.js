// server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
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

// Add this new GitHub contributions endpoint
// app.get('/api/github/:username/contributions', async (req, res) => {
//     try {
//         const { username } = req.params;
//         const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
        
//         // Get events from the last 12 weeks
//         const now = new Date();
//         const twelveWeeksAgo = new Date(now.getTime() - (12 * 7 * 24 * 60 * 60 * 1000));
        
//         // Initialize contribution counts for each week
//         const contributions = Array(12).fill(0);
        
//         response.data.forEach(event => {
//             const eventDate = new Date(event.created_at);
//             if (eventDate > twelveWeeksAgo) {
//                 // Calculate which week this event belongs to (0-11)
//                 const weekIndex = 11 - Math.floor((now - eventDate) / (7 * 24 * 60 * 60 * 1000));
//                 if (weekIndex >= 0 && weekIndex < 12) {
//                     // Count various contribution types
//                     if (event.type === 'PushEvent') {
//                         contributions[weekIndex] += event.payload.commits?.length || 0;
//                     } else if (['CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
//                         contributions[weekIndex]++;
//                     }
//                 }
//             }
//         });
        
//         res.json(contributions);
//     } catch (error) {
//         console.error('GitHub API Error:', error);
//         res.status(500).json(Array(12).fill(0));
//     }
// });

app.get('/api/github/:username/contributions', async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
        
        // Get events from the last 12 months
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        // Initialize contribution counts for each month
        const contributions = Array(12).fill(0);
        
        response.data.forEach(event => {
            const eventDate = new Date(event.created_at);
            if (eventDate > twelveMonthsAgo) {
                // Calculate which month this event belongs to (0-11)
                const monthsAgo = 11 - (
                    (now.getMonth() - eventDate.getMonth() + 
                    (now.getFullYear() - eventDate.getFullYear()) * 12) % 12
                );
                
                if (monthsAgo >= 0 && monthsAgo < 12) {
                    // Count various contribution types
                    if (event.type === 'PushEvent') {
                        contributions[monthsAgo] += event.payload.commits?.length || 0;
                    } else if (['CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
                        contributions[monthsAgo]++;
                    }
                }
            }
        });
        
        res.json(contributions);
    } catch (error) {
        console.error('GitHub API Error:', error);
        res.status(500).json(Array(12).fill(0));
    }
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});