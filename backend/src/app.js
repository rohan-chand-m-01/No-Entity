const express = require('express');
const cors = require('cors');
const busRoutes = require('./routes/bus');
const searchRoutes = require('./routes/search');
const ivrRoutes = require('./routes/ivr');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for Twilio Webhooks

app.use('/api', busRoutes);
app.use('/api/search', searchRoutes);
app.use('/ivr', ivrRoutes);

app.get('/', (req, res) => {
    res.send('LocalGati Realtime Engine is Running...');
});

module.exports = app;
