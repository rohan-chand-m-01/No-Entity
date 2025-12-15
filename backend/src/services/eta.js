/**
 * Calculates the great-circle distance between two points (in km).
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Calculates ETA in minutes based on distance (km) and speed (km/h).
 * Adds a small buffer for traffic.
 */
function calculateETA(distanceKm, speedKmh) {
    if (speedKmh <= 0) return "N/A";
    const timeHours = distanceKm / speedKmh;
    const timeMinutes = Math.ceil(timeHours * 60);
    return timeMinutes; // Returns integer minutes
}

module.exports = {
    getDistanceFromLatLonInKm,
    calculateETA
};
