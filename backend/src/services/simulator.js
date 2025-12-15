const { getDistanceFromLatLonInKm, calculateETA } = require('./eta');
const busesData = require('../data/buses.json');

// In-memory state
let buses = JSON.parse(JSON.stringify(busesData));

const UPDATE_INTERVAL_MS = 5000;
const INTERVAL_SECONDS = UPDATE_INTERVAL_MS / 1000;

function startSimulation() {
    console.log("Starting LocalGati Simulation Engine...");
    setInterval(() => {
        buses.forEach(updateBusPosition);
    }, UPDATE_INTERVAL_MS);
}

function updateBusPosition(bus) {
    const currentStop = bus.stops[bus.currentStopIndex];
    const nextStopIndex = bus.nextStopIndex;
    const nextStop = bus.stops[nextStopIndex];

    // Distance to cover in this tick
    const distanceToTravel = (bus.speed / 3600) * INTERVAL_SECONDS;

    // Check if we have detailed path (legs) for this segment
    // legs[i] should be the path FROM stops[i] TO stops[i+1]
    // The path should INCLUDE the start and end text ideally, or just intermediates.
    // Convention: legs[i] = [ {lat, lng}, {lat, lng} ... ] (intermediates)
    // Full path for calculation: [currentStop, ...legs[i], nextStop]

    let path = [currentStop];
    if (bus.legs && bus.legs[bus.currentStopIndex]) {
        path = [currentStop, ...bus.legs[bus.currentStopIndex], nextStop];
    } else {
        path = [currentStop, nextStop];
    }

    if (bus.distanceCoveredInSegment === undefined) {
        bus.distanceCoveredInSegment = 0;
    }

    bus.distanceCoveredInSegment += distanceToTravel;

    // Calculate total length of the path
    let totalPathDistance = 0;
    let distAccumulator = 0;
    let newLat = bus.lat;
    let newLng = bus.lng;
    let pathFound = false;

    // First pass: Calculate total distance
    for (let i = 0; i < path.length - 1; i++) {
        totalPathDistance += getDistanceFromLatLonInKm(
            path[i].lat, path[i].lng,
            path[i + 1].lat, path[i + 1].lng
        );
    }

    // Check if we reached the destination (next stop)
    if (bus.distanceCoveredInSegment >= totalPathDistance) {
        // Reached next stop
        console.log(`Bus ${bus.busNo} reached ${nextStop.name}`);

        // Move indices
        bus.currentStopIndex = bus.nextStopIndex;
        bus.nextStopIndex = (bus.nextStopIndex + 1) % bus.stops.length;

        // Reset segment tracking
        bus.distanceCoveredInSegment = 0;

        // Snap to stop location
        bus.lat = nextStop.lat;
        bus.lng = nextStop.lng;
    } else {
        // Find exactly where we are on the path
        let remainingDist = bus.distanceCoveredInSegment;

        for (let i = 0; i < path.length - 1; i++) {
            const segmentLen = getDistanceFromLatLonInKm(
                path[i].lat, path[i].lng,
                path[i + 1].lat, path[i + 1].lng
            );

            if (remainingDist <= segmentLen) {
                // We are in this segment
                const ratio = remainingDist / segmentLen;
                newLat = path[i].lat + (path[i + 1].lat - path[i].lat) * ratio;
                newLng = path[i].lng + (path[i + 1].lng - path[i].lng) * ratio;
                pathFound = true;
                break;
            } else {
                remainingDist -= segmentLen;
            }
        }

        if (pathFound) {
            bus.lat = newLat;
            bus.lng = newLng;
        } else {
            // Fallback (shouldn't happen if math is right, but safe guard)
            bus.lat = nextStop.lat;
            bus.lng = nextStop.lng;
        }
    }

    // Update Metadata
    const distToNext = getDistanceFromLatLonInKm(bus.lat, bus.lng, bus.stops[bus.nextStopIndex].lat, bus.stops[bus.nextStopIndex].lng);
    bus.distanceRemaining = distToNext;
    bus.eta = calculateETA(distToNext, bus.speed);
}

function getBus(busNo) {
    const exactMatch = buses.find(b => b.busNo === busNo);
    if (exactMatch) return exactMatch;

    // Try matching if the busNo ends with the input (e.g. "KA-01-189" matches "189")
    // or if the input is contained in the busNo
    return buses.find(b => b.busNo.includes(busNo));
}

function getAllBuses() {
    return buses;
}

module.exports = {
    startSimulation,
    getBus,
    getAllBuses
};
