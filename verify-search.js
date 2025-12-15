import http from 'http';

function get(path, callback) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => { responseData += chunk; });
        res.on('end', () => {
            callback(null, res.statusCode, responseData);
        });
    });

    req.on('error', (e) => {
        callback(e);
    });

    req.end();
}

console.log("Testing /api/search?source=Kengeri...");
get('/api/search?source=Kengeri', (err, status, body) => {
    if (err) return console.error(err);
    console.log(`Status: ${status}`);
    try {
        const data = JSON.parse(body);
        if (Array.isArray(data) && data.length > 0) {
            console.log(`PASS: Found ${data.length} buses from Kengeri`);
            console.log("First match:", data[0]);
        } else {
            console.log("FAIL: No buses found or invalid format", body);
        }
    } catch (e) {
        console.log("FAIL: Invalid JSON", body);
    }
});
