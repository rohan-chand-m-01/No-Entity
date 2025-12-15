const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const simulator = require('../services/simulator');
const smsFormatter = require('../services/smsFormatter');

// Need to load env vars if not already loaded (though server.js usually does)
require('dotenv').config();

let client;
try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    } else {
        console.warn("Twilio credentials missing. IVR routes will fail.");
    }
} catch (err) {
    console.error("Twilio init error:", err);
}

// 1. POST /ivr/welcome
router.post('/welcome', (req, res) => {
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
        numDigits: 1,
        action: '/ivr/language',
        method: 'POST'
    });

    gather.say('Welcome to Local Gati. Press 1 for English, 2 for Kannada, 3 for Hindi.');

    // Fallback if no input
    twiml.say('We did not receive any input. Goodbye!');

    res.type('text/xml');
    res.send(twiml.toString());
});

// 2. POST /ivr/language
router.post('/language', (req, res) => {
    const twiml = new VoiceResponse();
    const digits = req.body.Digits;

    // Map digits to language codes
    let lang = 'en';
    if (digits === '2') lang = 'kn';
    if (digits === '3') lang = 'hi';

    const gather = twiml.gather({
        numDigits: 3,
        action: `/ivr/bus-number?lang=${lang}`,
        method: 'POST'
    });

    if (lang === 'kn') {
        gather.say('Daya madi nimma 3 ankiya bus samkhyeyannu namudisi.');
    } else if (lang === 'hi') {
        gather.say('Kripya apna 3 anko ka bus number darj karein.');
    } else {
        gather.say('Please enter your 3-digit bus number.');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// 3. POST /ivr/bus-number
router.post('/bus-number', (req, res) => {
    const twiml = new VoiceResponse();
    const lang = req.query.lang || 'en';
    const busNo = req.body.Digits;

    // Fetch bus data strictly via internal service
    const bus = simulator.getBus(busNo);

    if (bus) {
        // Redirect to send-sms to trigger the message
        twiml.redirect({
            method: 'POST'
        }, `/ivr/send-sms?lang=${lang}&busNo=${busNo}`);
    } else {
        if (lang === 'kn') twiml.say('Kshamisi, bus sigalilla.');
        else if (lang === 'hi') twiml.say('Maaf karein, bus nahi mili.');
        else twiml.say('Sorry, bus not found.');

        twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// 4. POST /ivr/send-sms
router.post('/send-sms', async (req, res) => {
    const twiml = new VoiceResponse();
    const lang = req.query.lang || 'en';
    const busNo = req.query.busNo;
    const caller = req.body.From;

    try {
        const bus = simulator.getBus(busNo);
        if (bus) {
            const smsText = smsFormatter.formatSMS(bus, lang);

            // Send SMS via Twilio using the backend credentials
            // Note: In trial mode, 'to' number must be verified.
            if (client) {
                await client.messages.create({
                    body: smsText,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: caller
                });
            } else {
                console.error("Twilio client not initialized. Cannot send SMS.");
                twiml.say('System error: Twilio not configured.');
                res.type('text/xml');
                res.send(twiml.toString());
                return;
            }

            if (lang === 'kn') twiml.say('Nimma bus vivaragala SMS kalediyallide. Dhanyavadagalu.');
            else if (lang === 'hi') twiml.say('Aapke bus ki jankari SMS dwara bhej di gayi hai. Dhanyavaad.');
            else twiml.say('Your bus details have been sent through SMS. Thank you for using Local Gati.');
        } else {
            twiml.say('Error retrieving bus details.');
        }
    } catch (error) {
        console.error("SMS Error:", error);
        twiml.say('Sorry, we could not send the SMS at this time.');
    }

    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
});

// 5. POST /ivr/call-user (Outbound Trigger)
router.post('/call-user', async (req, res) => {
    const userPhone = req.body.phone || process.env.TWILIO_PHONE_NUMBER; // Target phone
    const publicUrl = process.env.PUBLIC_URL; // ngrok/localtunnel URL

    if (!publicUrl) {
        return res.status(500).json({ error: "PUBLIC_URL not configured in .env" });
    }

    if (!client) {
        return res.status(500).json({ error: "Twilio client not initialized" });
    }

    try {
        const call = await client.calls.create({
            url: `${publicUrl}/ivr/welcome`,
            to: userPhone,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.json({ success: true, callSid: call.sid, message: "Calling user..." });
    } catch (error) {
        console.error("Outbound Call Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 6. POST /ivr/simulate-sms (Frontend Simulation Trigger)
router.post('/simulate-sms', async (req, res) => {
    const { phone, busNo, lang } = req.body;

    if (!phone || !busNo) {
        return res.status(400).json({ status: 'error', message: 'Missing phone or busNo' });
    }

    if (!client) {
        return res.status(500).json({ status: 'error', message: 'Twilio client not initialized' });
    }

    try {
        const bus = simulator.getBus(busNo);
        if (bus) {
            const smsText = smsFormatter.formatSMS(bus, lang || 'en');

            await client.messages.create({
                body: smsText,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone
            });

            res.json({ status: 'sent', message: smsText });
        } else {
            res.status(404).json({ status: 'error', message: 'Bus not found' });
        }
    } catch (error) {
        console.error("Simulation SMS Error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
