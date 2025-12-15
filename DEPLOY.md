# 🚀 Deployment Guide (Vercel)

This project is configured for easy deployment on [Vercel](https://vercel.com).
Since it is a MERN stack (Vite Frontend + Express Backend), we use Vercel's **Serverless Functions** to host the backend.

## 1. Prerequisites
- A GitHub account.
- A Vercel account.

## 2. Push to GitHub
Ensure your latest code is pushed to your repository.
```bash
git add .
git commit -m "chore: Configure for Vercel deployment"
git push origin main
```

## 3. Import in Vercel
1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your repository (`No-Entity`).
4.  **Framework Preset**: Select `Vite`.
5.  **Root Directory**: Leave as `./` (default).

## 4. Environment Variables (Critical!)
Before clicking Deploy, expand the **"Environment Variables"** section and add the following:

| Key | Value |
| :--- | :--- |
| `TWILIO_ACCOUNT_SID` | *Your Twilio SID* |
| `TWILIO_AUTH_TOKEN` | *Your Twilio Auth Token* |
| `TWILIO_PHONE_NUMBER` | *Your Twilio Phone Number* |

> **Note**: You do not need to set `PORT`. Vercel handles this.

## 5. Deploy
Click **"Deploy"**.
Vercel will build the frontend and set up the backend API automatically.

- **Frontend URL**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.vercel.app/api/...`

## Troubleshooting
- If the API returns 404, check usage of `/api/` prefix in `vercel.json`.
- The `api/index.js` file acts as the entry point for all backend logic.
