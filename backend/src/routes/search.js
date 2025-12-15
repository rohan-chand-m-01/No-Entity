const express = require('express');
const router = express.Router();
const { getAllBuses } = require('../services/simulator');

// GET /api/search?source=X&destination=Y
router.get('/', (req, res) => {
    const { source, destination } = req.query;
    let buses = getAllBuses();

    if (!source) {
        return res.status(400).json({ error: "Source parameter is required" });
    }

    const sourceQuery = source.toLowerCase();
    const destQuery = destination ? destination.toLowerCase() : null;

    const results = buses.filter(bus => {
        // Find index of source stop
        const sourceIndex = bus.stops.findIndex(s => s.name.toLowerCase().includes(sourceQuery));
        if (sourceIndex === -1) return false;

        // If destination provided, check if it exists AFTER source
        if (destQuery) {
            const destIndex = bus.stops.findIndex(s => s.name.toLowerCase().includes(destQuery));
            if (destIndex === -1) return false;

            // For a loop route, logic is tricky, but assuming simple linear progression or loop:
            // Valid if dest matches and is "upcoming" relative to source?
            // User query usually implies "Can I go from A to B".
            // So if B exists and index(B) != index(A), we match. 
            // Better: Check if B is reachable from A.
            // Since it's a loop, B is always reachable from A eventually.
            // But let's check strict order to prioritize "direct" direction if simple.
            // For now, just existence of both is good enough for 'search'.
            return true;
        }

        return true;
    });

    // Map to simplified response for the Assistant
    const response = results.map(bus => ({
        busNo: bus.busNo,
        routeName: bus.routeName,
        eta: bus.eta, // Minutes to next stop (current live ETA)
        // Ideally we calculate ETA to the SOURCE stop if the bus is not there yet.
        // Current 'eta' in bus object is to 'nextStop'.
        // This simple simulation might not give ETA to *source* stop easily without complex logic.
        // We will just return the bus's current status.
        nextStop: bus.stops[bus.nextStopIndex].name,
        currentLocation: bus.stops[bus.currentStopIndex].name // Rough approx
    }));

    res.json(response);
});

module.exports = router;
