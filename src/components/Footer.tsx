import React from 'react';
import { Github, Twitter, Mail, Bus } from 'lucide-react';
import { useLanguage } from '../hooks/useAppLanguage';

const Footer: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-white dark:bg-background border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Bus className="w-5 h-5 text-white dark:text-background" />
                            </div>
                            <span className="text-xl font-bold text-primary tracking-tight">{t.appTitle}</span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">
                            {t.footer.desc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-primary mb-4">{t.footer.platform}</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.liveTracking}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.aiAssistant}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.ivrServices}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.aboutUs}</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-primary mb-4">{t.footer.resources}</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.docs}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.community}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.help}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.privacy}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-primary mb-4">{t.footer.contact}</h3>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li className="flex items-center gap-2">
                                <Github className="w-4 h-4" />
                                <a href="https://github.com/VenkateshReddy007/Musafir" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t.footer.social.github}</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Twitter className="w-4 h-4" />
                                <a href="#" className="hover:text-primary transition-colors">{t.footer.social.twitter}</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:support@localgati.com" className="hover:text-primary transition-colors">{t.emailLabel}: support@localgati.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-secondary text-sm">
                        © {new Date().getFullYear()} {t.appTitle}. {t.footer.rights}
                    </p>
                    <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-secondary font-medium">{t.footer.systemOp}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
