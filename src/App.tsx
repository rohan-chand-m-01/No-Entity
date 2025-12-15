import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useAppLanguage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveTracking from './pages/LiveTracking';
import Chatbot from './pages/Chatbot';
import IvrDemo from './pages/IvrDemo';
import About from './pages/About';

import { ThemeProvider } from './hooks/useTheme';

import AssistantWidget from './components/AssistantWidget';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen bg-background text-primary font-sans selection:bg-accent selection:text-white">
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/active-tracker" element={<LiveTracking />} />
                {/* Note: I used /active-tracking in Navbar, fixing consistency */}
                <Route path="/active-tracking" element={<LiveTracking />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/ivr-demo" element={<IvrDemo />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <AssistantWidget />
            <Footer />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
