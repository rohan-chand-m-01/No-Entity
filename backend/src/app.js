const express = require('express');
const cors = require('cors');
const busRoutes = require('./routes/bus');
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', busRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
    res.send('LocalGati Realtime Engine is Running...');
});

module.exports = app;
