import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useAppLanguage';
import { Menu, X, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
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
        <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-500">
                            {t.appTitle}
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                                            ? 'bg-violet-100 text-violet-700'
                                            : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="bg-transparent text-sm text-slate-700 font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-violet-600 hover:bg-violet-50 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                                        ? 'bg-violet-100 text-violet-700'
                                        : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex items-center px-3 py-2 space-x-2" >
                            <Globe className="w-4 h-4 text-slate-500" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="bg-transparent text-base text-slate-700 font-medium focus:outline-none w-full"
                            >
                                <option value="en">English</option>
                                <option value="kn">ಕನ್ನಡ</option>
                                <option value="hi">हिंदी</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
