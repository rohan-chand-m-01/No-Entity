# Inclusive Public Transport Live Tracking System 🚌

A modern, inclusive, and accessible web application designed to make public transport tracking easy for everyone. This project features real-time bus tracking simulation, multilingual support, and accessibility-first design choices.

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Key Features

*   **📍 Live Bus Tracking**: Real-time mock tracking of buses with ETA and location updates.
*   **🗣️ Multilingual Support**: Fully localized in English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ).
*   **🤖 AI Chatbot Assistant**: Interactive assistant to answer queries about bus timings and routes.
*   **📞 IVR Demo**: Simulation of an Interactive Voice Response system for non-smartphone users.
*   **♿ Inclusive Design**: High contrast capabilities, clear typography, and screen-reader friendly structure.
*   **📱 Responsive UI**: Works seamlessly on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

*   **Frontend**: React 18, TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Routing**: React Router DOM
*   **Maps**: Leaflet / React-Leaflet (Ready configuration)

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites
*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rohan-chand-m-01/No-Entity.git
    cd No-Entity
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the application.

## 📂 Project Structure

```
src/
├── api/            # Mock API services (bus, sms, ivr)
├── components/     # Reusable UI components (Navbar, Footer, etc.)
├── data/           # Static mock data (buses.json)
├── hooks/          # Custom hooks (useAppLanguage)
├── lang/           # Localization files (en.json, hi.json, kn.json)
├── pages/          # Application pages (Home, LiveTracking, etc.)
└── App.tsx         # Main application entry point
```

## 🔮 Future Roadmap

*   [ ] Integration with real GPS hardware API.
*   [ ] Backend implementation for user authentication.
*   [ ] Real-time SMS gateway integration.
*   [ ] Expanded language support.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Developed with ❤️ for inclusive mobility by team- No Entity
