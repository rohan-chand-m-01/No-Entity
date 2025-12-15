const express = require('express');
const router = express.Router();
const simulator = require('../services/simulator');
const smsFormatter = require('../services/smsFormatter');

// GET /api/buses
router.get('/buses', (req, res) => {
    const buses = simulator.getAllBuses();
    res.json(buses);
});

// GET /api/bus/:busNo
router.get('/bus/:busNo', (req, res) => {
    const bus = simulator.getBus(req.params.busNo);
    if (bus) {
        res.json(bus);
    } else {
        res.status(404).json({ error: "Bus not found" });
    }
});

// GET /api/bus/:busNo/sms-format?lang=en|kn|hi
router.get('/bus/:busNo/sms-format', (req, res) => {
    const bus = simulator.getBus(req.params.busNo);
    const lang = req.query.lang || 'en';

    if (bus) {
        const message = smsFormatter.formatSMS(bus, lang);
        res.json({ busNo: bus.busNo, lang, message });
    } else {
        res.status(404).json({ error: "Bus not found" });
    }
});

module.exports = router;
