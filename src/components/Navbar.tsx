import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useAppLanguage';
import { Menu, X, Globe, Bus, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Navbar: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: t.nav.home, path: '/' },
        { name: t.nav.track, path: '/active-tracking' },
        { name: t.nav.chat, path: '/chat' },
        { name: t.nav.ivr, path: '/ivr-demo' },
        { name: t.nav.about, path: '/about' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white/95 dark:bg-background/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        {/* Simple Tech Logo */}
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Bus className="w-5 h-5 text-white dark:text-background" />
                        </div>
                        <Link to="/" className="text-xl font-bold text-primary tracking-tight">
                            {t.appTitle}
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'text-primary bg-accent/10 border border-accent/20'
                                        : 'text-secondary hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center space-x-1 text-secondary hover:text-primary transition-colors">
                            <Globe className="w-4 h-4 dark:text-slate-300" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer p-1 dark:bg-transparent dark:text-white border-none focus:ring-0"
                            >
                                <option value="en" className="text-black">English</option>
                                <option value="kn" className="text-black">ಕನ್ನಡ</option>
                                <option value="hi" className="text-black">हिंदी</option>
                            </select>
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-primary hover:bg-slate-50 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                    ? 'bg-accent/10 text-primary'
                                    : 'text-secondary hover:bg-slate-50 hover:text-primary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center px-3 py-2 space-x-2 border-t border-slate-100 dark:border-slate-800 mt-2 pt-3" >
                            <Globe className="w-4 h-4 text-secondary dark:text-slate-400" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="bg-transparent text-base text-primary dark:text-white font-medium focus:outline-none w-full"
                            >
                                <option value="en" className="text-black">English</option>
                                <option value="kn" className="text-black">ಕನ್ನಡ</option>
                                <option value="hi" className="text-black">हिंदी</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
