import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  const languages = [
    { code: Language.EN, name: 'English', label: 'En', flag: '🇺🇸', desc: 'Enterprise Standard' },
    { code: Language.FR, name: 'Français', label: 'Fr', flag: '🇫🇷', desc: 'Standard Européen' },
    { code: Language.AR, name: 'العربية', label: 'Ar', flag: '🇸🇦', desc: 'المعيار العربي' }
  ];

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 blur-[130px] rounded-full -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/5 blur-[130px] rounded-full -ml-64 -mb-64 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M12 9a11.959 11.959 0 01-2.683 5.66m.005 0l-.547.547M12 9A11.959 11.959 0 019.018 4.5h2.528M9.018 4.5H3.5m10.5 12h7m-3.5-3.5V21" /></svg>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Choose Language</h2>
          <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.4em]">Configuring Localization Modules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="group relative flex flex-col items-center p-8 bg-brand-dark/40 backdrop-blur-xl rounded-[40px] border border-white/5 hover:border-brand-primary/40 transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30">
                {lang.flag}
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-brand-primary transition-colors">{lang.name}</div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed whitespace-nowrap">{lang.desc}</div>
              </div>

              {/* Active Indicator Hover Effect */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_10px_#0070f3]"></div>
            </button>
          ))}
        </div>

        <div className="mt-20 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/5 rounded-full ring-1 ring-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase font-bold">Secure Local Environment Ready</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;
