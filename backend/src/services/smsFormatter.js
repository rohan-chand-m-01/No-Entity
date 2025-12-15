const fs = require('fs');
const path = require('path');

const langCache = {
    en: require('../lang/en.json'),
    kn: require('../lang/kn.json'),
    hi: require('../lang/hi.json')
};

function formatSMS(bus, lang = 'en') {
    const templates = langCache[lang] || langCache['en'];

    // Find next stop name
    const nextStop = bus.stops[bus.nextStopIndex];
    const nextStopName = nextStop ? nextStop.name : "Unknown";

    // Calculate ETA text
    const etaVal = bus.eta || 0;
    const etaText = templates.eta_text.replace('{{minutes}}', etaVal);

    // Format message
    let message = templates.sms_template;
    message = message.replace('{{busNo}}', bus.busNo);
    message = message.replace('{{nextStop}}', nextStopName);
    message = message.replace('{{eta}}', etaText);
    message = message.replace('{{distance}}', (bus.distanceRemaining || 0).toFixed(1));
    message = message.replace('{{route}}', bus.routeName);

    return message;
}

module.exports = { formatSMS };
