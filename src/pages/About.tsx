import React from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
import { Users, Target, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container max-w-4xl mx-auto space-y-12 text-center md:text-left">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">{t.about.title}</h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    We are dedicated to removing barriers in public transportation through innovative, accessible technology.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-6"
                >
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-4 mx-auto md:mx-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Our Mission</h3>
                    <p className="text-sm text-slate-500">
                        {t.about.mission} To provide real-time data that empowers every commuter, regardless of ability.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4 mx-auto md:mx-0">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Inclusivity</h3>
                    <p className="text-sm text-slate-500">
                        Built with accessibility first. Voice support, high contrast, and screen reader compatibility are standard.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4 mx-auto md:mx-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">The Team</h3>
                    <p className="text-sm text-slate-500">
                        A passionate group of developers hacking for social good.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
