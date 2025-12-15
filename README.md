<div align="center">

  <h1>🚌 LocalGati (ಲೋಕಲ್‌ಗತಿ)</h1>
  
  <h3>Making Urban Mobility Accessible, Predictable, and Stress-Free for Everyone.</h3>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

  ![Status](https://img.shields.io/badge/Status-Prototype-blue?style=for-the-badge&logo=statuspage)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative)
  ![Platform](https://img.shields.io/badge/Platform-Web-orange?style=for-the-badge&logo=google-chrome)

</div>

<br />

## 📖 Overview

**LocalGati** is a modern, inclusive, and accessible web application designed to bridge the gap between commuters and public transit systems. By leveraging technology, we aim to make bus tracking easy, distinct, and reliable for everyone, including those with disabilities or language barriers.

> *"Public transport is the lifeline of any major city. We believe in an inclusive future where technology serves everyone."*

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **📍 Live Bus Tracking** | Real-time mock tracking of buses with detailed ETA, location statuses (e.g., "MG Road", "Marathahalli"), and crowd indicators. |
| **🗣️ Multilingual Support** | Complete localization in **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिंदी)** to serve a diverse user base. |
| **🤖 AI Chatbot Assistant** | Intelligent assistant powered by **Gemini AI** to answer queries like *"Where is bus 189?"* or *"When will the next bus arrive?"*. |
| **📞 IVR Demo** | Accessibility-first "Call-to-SMS" simulation for non-smartphone users. Dial to receive status via SMS. |
| **♿ Inclusive Design** | Built with accessibility in mind: high contrast colors, clear typography, screen-reader friendly architecture, and simple navigation. |
| **📱 Responsive UI** | A seamless experience across manageable desktops, tablets, and mobile devices. |

---

## 🛠️ Tech Stack

<div align="center">
	<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
	<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
	<img src="https://img.shields.io/badge/Vite-B73C92?style=for-the-badge&logo=vite&logoColor=white" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
	<img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google-bard&logoColor=white" />
</div>

*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS, Framer Motion (Animations)
*   **Mapping**: Leaflet / React-Leaflet
*   **Icons**: Lucide React
*   **Routing**: React Router DOM

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

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
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to experience LocalGati.

---

## 📂 Project Structure

```bash
src/
├── api/            # Mock API services (simulation for Bus, SMS, IVR)
├── components/     # Reusable UI components (Navbar, Footer, Maps, etc.)
├── data/           # Static mock data (buses.json)
├── hooks/          # Custom hooks (useAppLanguage, Theme handling)
├── lang/           # Localization files (en.json, hi.json, kn.json)
├── pages/          # Application views (Home, LiveTracking, Chatbot, IVR)
└── App.tsx         # Main entry point
```

---

## 🔮 Future Roadmap

*   [ ] Integration with real-time GPS hardware APIs (GTFS).
*   [ ] Backend implementation for user authentication & preferences.
*   [ ] Real-time SMS gateway integration (Twilio/Exotel).
*   [ ] Voice-enabled navigation for the blind.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

<div align="center">
  <p>Developed with ❤️ for <strong>Inclusive Mobility</strong> by <strong>Team No Entity</strong></p>
  <p>© 2025 LocalGati. All rights reserved.</p>
</div>
