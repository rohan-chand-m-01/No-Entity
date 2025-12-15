# 🚌 LocalGati: Inclusive Public Transport Tracking

![Status](https://img.shields.io/badge/Status-Prototype-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Stack](https://img.shields.io/badge/Stack-MERN-orange)

**LocalGati** is a next-generation public transport companion app designed for **inclusive, real-time, and accessible** travel. It bridges the gap between complex transit data and everyday commuters using AI, Voice, and SMS technology.

---

## 🌟 Key Features

### 📍 Live Bus Tracking
Real-time GPS tracking of buses with accurate ETAs. Visualized on an interactive map.

### 🤖 Gati Sahayak (AI Assistant)
Your personal travel companion.
- **Voice-Enabled**: Speak to the assistant in natural language.
- **Multilingual**: Supports English, Kannada (ಕನ್ನಡ), and Hindi (हिंदी).
- **Context Aware**: Asks for relevant details ("Which bus stop?") to provide precise answers.

### 📞 IVR & SMS Integration (Twilio)
Bridging the digital divide for offline users.
- **Simulated IVR**: A full in-browser IVR experience.
- **Real SMS**: Integration with **Twilio** to send actual bus status alerts to your phone.
- **Native Language Support**: IVR and SMS content automatically converts to Kannada/Hindi numerals and text.

### ♿ Accessibility First
Built for everyone.
- High-contrast UI options.
- Screen-reader friendly architecture.
- Simple, intuitive navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Integrations**: Twilio (SMS/Voice), OpenStreetMap (Leaflet)
- **Tools**: Vite, Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Twilio Account (for SMS features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohan-chand-m-01/No-Entity.git
   cd No-Entity
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

4. **Run the Application**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   node backend/src/server.js
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`.

---

## 📱 How to Demo the IVR System

1. Go to the **Call Demo** page.
2. Enter your **real mobile number** (e.g., 9988776655).
3. Select your language (English, Kannada, or Hindi).
4. Enter a bus number (e.g., `189`, `335E`).
5. **Watch the Magic**: 
   - The on-screen phone simulates the call.
   - You receive a **real SMS** on your mobile device!
   - In Kannada mode, enjoy full native digit support (e.g., `೯೯೯`).

---

## 🔮 Future Roadmap

- [ ] Whatsapp Bot Integration
- [ ] Crowdsourced Bus Occupancy Data
- [ ] Offline Maps Support

---

Made with ❤️ for **Bengaluru Commuters**.
