import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'EN' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="bg-forest-900 text-neutral-200 text-xs py-2 px-4 border-b border-forest-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left / Start: Shipping message */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse overflow-hidden">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <p className="truncate font-light tracking-wide">
            {t('announcement.text')}
          </p>
        </div>

        {/* Right / End: Currency & Language Switcher */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse shrink-0">
          <div className="hidden sm:flex items-center space-x-1.5 rtl:space-x-reverse text-neutral-400 text-[11px] font-mono">
            <span>🇩🇿 DZD (DA)</span>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[11px]">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <div className="flex items-center divide-x divide-neutral-700 rtl:divide-x-reverse">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-1.5 transition-colors ${
                    currentLang.startsWith(lang.code)
                      ? 'text-white font-semibold underline underline-offset-4 decoration-heritage-gold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
