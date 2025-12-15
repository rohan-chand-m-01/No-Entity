import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useAppLanguage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveTracking from './pages/LiveTracking';
import Chatbot from './pages/Chatbot';
import IvrDemo from './pages/IvrDemo';
import About from './pages/About';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-200 selection:text-violet-900">
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
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;
