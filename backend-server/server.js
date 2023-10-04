const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'https://localhost:3000', // allow the specific origin
    allowedHeaders: ['Content-Type', 'Authorization'], // explicitly allow Authorization header
    methods: ["GET", "POST", "OPTIONS"], // allowed methods
}));

app.get('/api/proxy', async (req, res) => {
    console.log('Proxy request to: ' + req.query.endpoint);
    try {
        const response = await axios.get('https://api.1inch.dev' + req.query.endpoint);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
