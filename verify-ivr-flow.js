import http from 'http';

function post(path, body, callback) {
    const data = new URLSearchParams(body).toString();
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
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

    req.write(data);
    req.end();
}

console.log("1. Testing /ivr/welcome...");
post('/ivr/welcome', {}, (err, status, body) => {
    if (err) return console.error(err);
    console.log(`Status: ${status}`);
    if (body.includes('<Gather')) console.log("PASS: Received Gather TwiML");
    else console.log("FAIL: " + body);

    console.log("\n2. Testing /ivr/language (English)...");
    post('/ivr/language', { Digits: '1' }, (err, status, body) => {
        if (err) return console.error(err);
        console.log(`Status: ${status}`);
        if (body.includes('action="/ivr/bus-number?lang=en"')) console.log("PASS: Redirects to bus-number with lang=en");
        else console.log("FAIL: " + body);

        console.log("\n3. Testing /ivr/bus-number (Bus 189)...");
        post('/ivr/bus-number?lang=en', { Digits: '189' }, (err, status, body) => {
            if (err) return console.error(err);
            console.log(`Status: ${status}`);
            if (body.includes('/ivr/send-sms?lang=en&amp;busNo=189')) console.log("PASS: Redirects to send-sms for 189");
            else console.log("FAIL: " + body);

            console.log("\n4. Testing /ivr/send-sms (Bus 189)...");
            // Note: This will attempt to send a real SMS if credentials are valid!
            post('/ivr/send-sms?lang=en&busNo=189', { From: '+15550000000' }, (err, status, body) => {
                if (err) return console.error(err);
                console.log(`Status: ${status}`);
                if (body.includes('Your bus details have been sent')) console.log("PASS: Received success TwiML");
                else console.log("FAIL: " + body);
            });
        });
    });
});
