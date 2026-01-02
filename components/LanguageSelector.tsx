import React from 'react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-darker/95 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center space-y-8 relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-secondary"></div>
        
        <div>
          <h2 className="text-3xl font-bold text-brand-darker">Welcome</h2>
          <p className="text-brand-primary mt-3 text-sm">Please select your preferred interface language to begin the assessment.</p>
        </div>
        
        <div className="space-y-3">
          {[
            { id: Language.EN, label: 'English', sub: 'Default' },
            { id: Language.FR, label: 'Français', sub: 'Sélectionner' },
            { id: Language.AR, label: 'العربية', sub: 'اختر اللغة', rtl: true }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="w-full p-4 border border-gray-100 rounded-xl hover:border-brand-accent hover:bg-brand-surface hover:shadow-md transition-all duration-300 group flex items-center justify-between"
              dir={lang.rtl ? 'rtl' : 'ltr'}
            >
              <span className={`font-semibold text-lg text-gray-700 group-hover:text-brand-darker ${lang.rtl ? 'font-arabic' : ''}`}>
                {lang.label}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-brand-secondary uppercase tracking-wider font-medium">
                {lang.sub}
              </span>
            </button>
          ))}
        </div>
        
        <div className="pt-4 text-[10px] text-gray-300 uppercase tracking-widest">
          JustWhyUs Team Assessment
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;