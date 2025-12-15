import React from 'react';
import { useLanguage } from '../hooks/useAppLanguage';


const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container max-w-5xl space-y-12">

            {/* Mission Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-primary">{t.nav.about} {t.appTitle}</h1>
                <p className="text-lg text-secondary leading-relaxed">
                    {t.about.heroDesc}
                </p>
            </div>


            {/* Team / Values Section */}
            <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12">
                <div className="space-y-6 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-primary">{t.about.visionTitle}</h2>
                    <p className="text-secondary leading-relaxed">
                        {t.about.visionText}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default About;
