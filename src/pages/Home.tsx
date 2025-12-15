import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useAppLanguage';
import { MapPin, MessageSquare, Phone, Info, ArrowRight, Shield, Clock, Users } from 'lucide-react';
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

    const features = [
        { icon: Shield, title: t.home.features.secure.title, desc: t.home.features.secure.desc },
        { icon: Clock, title: t.home.features.realtime.title, desc: t.home.features.realtime.desc },
        { icon: Users, title: t.home.features.inclusive.title, desc: t.home.features.inclusive.desc },
    ];

    return (
        <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] pt-12 md:pt-0">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-6xl text-center space-y-16"
            >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-secondary uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        {t.home.badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
                        {t.home.heroTitle}
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
                        {t.home.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link to="/active-tracking" className="primary-button text-lg px-8 py-3">
                            {t.home.ctaTrack}
                        </Link>
                        <Link to="/about" className="secondary-button text-lg px-8 py-3">
                            {t.home.ctaLearn}
                        </Link>
                    </div>
                </motion.div>

                {/* Main Navigation Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    <Link to="/active-tracking" className="group">
                        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-clean-lg hover:border-accent/50 transition-all duration-300 h-full text-left">
                            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{t.nav.track}</h3>
                            <p className="text-secondary text-sm mb-4 leading-relaxed">{t.navDesc.track}</p>
                            <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                {t.navAction.track} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/chat" className="group">
                        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-clean-lg hover:border-accent/50 transition-all duration-300 h-full text-left">
                            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{t.nav.chat}</h3>
                            <p className="text-secondary text-sm mb-4 leading-relaxed">{t.navDesc.chat}</p>
                            <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                {t.navAction.chat} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/ivr-demo" className="group">
                        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-clean-lg hover:border-accent/50 transition-all duration-300 h-full text-left">
                            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{t.nav.ivr}</h3>
                            <p className="text-secondary text-sm mb-4 leading-relaxed">{t.navDesc.ivr}</p>
                            <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                {t.navAction.ivr} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>

                    <Link to="/about" className="group">
                        <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-clean-lg hover:border-accent/50 transition-all duration-300 h-full text-left">
                            <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-accent group-hover:text-primary transition-colors">
                                <Info className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{t.nav.about}</h3>
                            <p className="text-secondary text-sm mb-4 leading-relaxed">{t.navDesc.about}</p>
                            <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                {t.navAction.about} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Feature Highlights - Corporate Style */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-slate-200 dark:border-slate-800 w-full">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-secondary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">{feature.title}</h4>
                                <p className="text-sm text-secondary mt-1">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
