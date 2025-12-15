# LocalGati IVR Setup Guide

## 1. Prerequisites
- **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com).
- **Twilio Phone Number**: Buy a number with Voice and SMS capabilities.
- **ngrok**: Tool to expose your local server to the internet ([ngrok.com](https://ngrok.com)).

## 2. Environment Configuration
1. Open `backend/.env`.
2. Fill in your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## 3. Expose Local Server
Run ngrok to forward port 3000 (LocalGati backend):
```bash
ngrok http 3000
```
Copy the Forwarding URL, e.g., `https://abc1234.ngrok.io`.

## 4. Default Twilio Console Setup
1. Go to **Phone Numbers** > **Manage** > **Active Numbers**.
2. Click on your number.
3. Scroll to **Voice & Fax**.
4. Under **A Call Comes In**, select **Webhook**.
5. Enter your ngrok URL + `/ivr/welcome`:
   ```
   https://abc1234.ngrok.io/ivr/welcome
   ```
6. Ensure HTTP Method is **POST**.
7. Save.

## 5. Testing
1. **Call** your Twilio number from a verified phone.
2. You should hear: "Welcome to Local Gati..."
3. **Press 1** for English.
4. Prompt: "Please enter your 3-digit bus number."
5. **Enter 189**.
6. System checks backend, finds bus `189`.
7. You should hear: "Your bus details have been sent..."
8. **Check SMS**: You will receive an SMS with real-time stats for Bus 189.
