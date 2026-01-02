import React from 'react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-md animate-fade-in">
      <div className="bg-brand-darker rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] p-12 max-w-md w-full text-center space-y-10 border border-white/5 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-secondary"></div>

        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tight">Access Node</h2>
          <p className="text-brand-primary mt-4 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">System Protocol: Interface Language</p>
        </div>

        <div className="space-y-4">
          {[
            { id: Language.EN, label: 'English', sub: 'Primary' },
            { id: Language.FR, label: 'Français', sub: 'Secondaire' },
            { id: Language.AR, label: 'العربية', sub: 'البروتوكول الثالث', rtl: true }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className="w-full p-6 bg-brand-dark/50 border border-white/5 rounded-3xl hover:border-brand-accent hover:bg-brand-accent/5 hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-500 group flex items-center justify-between"
              dir={lang.rtl ? 'rtl' : 'ltr'}
            >
              <span className={`font-black text-xl text-gray-400 group-hover:text-white tracking-tight ${lang.rtl ? 'font-arabic' : ''}`}>
                {lang.label}
              </span>
              <span className="text-[9px] text-brand-primary opacity-40 group-hover:opacity-100 uppercase tracking-[0.2em] font-black transition-all">
                {lang.sub}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-6 text-[8px] font-mono text-white/5 uppercase tracking-[0.5em]">
          JustWhyUs Evolutionary Tool
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;