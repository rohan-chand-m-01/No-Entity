import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useAppLanguage';
import { MapPin, MessageSquare, Phone, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl text-center space-y-8"
            >
                <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        {t.home.heroTitle}
                        <span className="block gradient-text mt-2">{t.appTitle}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
                        {t.home.heroSubtitle}
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
                    <Link to="/active-tracking" className="group">
                        <div className="glass-card p-6 h-full hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-violet-500">
                            <div className="h-12 w-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-4 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.nav.track}</h3>
                            <p className="text-slate-500 text-sm mb-4">View real-time bus locations and ETA.</p>
                            <div className="flex items-center text-violet-600 font-semibold text-sm">
                                Go to Tracking <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/chat" className="group">
                        <div className="glass-card p-6 h-full hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-pink-500">
                            <div className="h-12 w-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.nav.chat}</h3>
                            <p className="text-slate-500 text-sm mb-4">Chat with our AI assistant for help.</p>
                            <div className="flex items-center text-pink-600 font-semibold text-sm">
                                Start Chat <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/ivr-demo" className="group">
                        <div className="glass-card p-6 h-full hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-teal-500">
                            <div className="h-12 w-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.nav.ivr}</h3>
                            <p className="text-slate-500 text-sm mb-4">Simulate call-to-SMS features.</p>
                            <div className="flex items-center text-teal-600 font-semibold text-sm">
                                Try Demo <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/about" className="group">
                        <div className="glass-card p-6 h-full hover:-translate-y-2 transition-transform duration-300 border-t-4 border-t-amber-500">
                            <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <Info className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.nav.about}</h3>
                            <p className="text-slate-500 text-sm mb-4">Learn about our mission and team.</p>
                            <div className="flex items-center text-amber-600 font-semibold text-sm">
                                Read More <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
