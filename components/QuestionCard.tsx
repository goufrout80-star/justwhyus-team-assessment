import React, { useEffect, useState } from 'react';
import { Question, QuestionType, Language } from '../types';

interface Props {
    question: Question;
    value: any;
    onChange: (val: any) => void;
    language: Language;
}

const QuestionCard: React.FC<Props> = ({ question, value, onChange, language }) => {
    const isRTL = language === Language.AR;

    // Helper to get text
    const getTxt = (obj: any) => {
        if (!obj) return "";
        if (language === Language.AR && obj.ar) return obj.ar;
        if (language === Language.FR && obj.fr) return obj.fr;
        return obj.en;
    };

    // --- Handlers ---
    const handleScaleChange = (val: number) => {
        onChange(val);
    };

    const handleMultiChange = (optId: string) => {
        // Value is expected to be an array of IDs for multiple
        const current = Array.isArray(value) ? value : [];
        if (current.includes(optId)) {
            onChange(current.filter((id: string) => id !== optId));
        } else {
            onChange([...current, optId]);
        }
    };

    // --- Renderers ---

    const renderScale = () => {
        if (!question.scale) return null;
        const { min, max, minLabel, maxLabel } = question.scale;
        const currentVal = typeof value === 'number' ? value : null;

        return (
            <div className="py-8">
                <div className="flex justify-between text-xs text-gray-500 mb-4 px-2 uppercase tracking-widest font-bold">
                    <span>{getTxt(minLabel)}</span>
                    <span>{getTxt(maxLabel)}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                    {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
                        <button
                            key={num}
                            onClick={() => handleScaleChange(num)}
                            className={`
                w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300
                ${currentVal === num
                                    ? 'bg-brand-accent text-brand-darker scale-110 shadow-lg shadow-brand-accent/50'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}
              `}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderSingle = () => {
        if (!question.options) return null;
        return (
            <div className="space-y-3 py-4">
                {question.options.map((opt) => (
                    <label
                        key={opt.id}
                        className={`
              flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
              ${value === opt.id
                                ? 'bg-brand-primary/10 border-brand-primary'
                                : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5'}
            `}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${value === opt.id ? 'border-brand-primary' : 'border-gray-500 group-hover:border-gray-400'}`}>
                            {value === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                        </div>
                        <input
                            type="radio"
                            name={`q-${question.id}`}
                            value={opt.id}
                            checked={value === opt.id}
                            onChange={() => onChange(opt.id)}
                            className="hidden"
                        />
                        <span className={`text-lg ${value === opt.id ? 'text-brand-primary font-medium' : 'text-gray-300'}`}>
                            {getTxt(opt.text)}
                        </span>
                    </label>
                ))}
            </div>
        );
    };

    const renderMulti = () => {
        if (!question.options) return null;
        const current = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-3 py-4">
                {question.options.map((opt) => {
                    const isSelected = current.includes(opt.id);
                    return (
                        <label
                            key={opt.id}
                            className={`
                flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                ${isSelected
                                    ? 'bg-brand-accent/10 border-brand-accent'
                                    : 'bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5'}
              `}
                        >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 ${isSelected ? 'border-brand-accent bg-brand-accent' : 'border-gray-500 group-hover:border-gray-400'}`}>
                                {isSelected && (
                                    <svg className="w-3 h-3 text-brand-darker font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleMultiChange(opt.id)}
                                className="hidden"
                            />
                            <span className={`text-lg ${isSelected ? 'text-brand-accent font-medium' : 'text-gray-300'}`}>
                                {getTxt(opt.text)}
                            </span>
                        </label>
                    );
                })}
            </div>
        );
    };

    const renderText = (isLong: boolean) => {
        const placeholder = isRTL
            ? "اكتب إجابتك هنا..."
            : isLong ? "Please explain in detail..." : "Type your answer here...";

        if (isLong) {
            return (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full h-64 p-6 bg-transparent text-lg text-gray-200 leading-relaxed resize-none focus:bg-white/5 outline-none border border-transparent focus:border-white/10 rounded-xl transition-all duration-300 placeholder-gray-600 ${isRTL ? 'text-right font-arabic' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    spellCheck="false"
                />
            );
        }
        return (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-6 bg-transparent text-xl text-gray-200 outline-none border-b-2 border-white/10 focus:border-brand-primary transition-all duration-300 placeholder-gray-600 ${isRTL ? 'text-right font-arabic' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                autoComplete="off"
            />
        );
    };

    return (
        <div className="w-full animate-fade-in">
            <h2
                className={`text-2xl sm:text-3xl font-semibold text-white mb-8 leading-tight ${isRTL ? 'text-right font-arabic' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {getTxt(question.text)}
            </h2>

            <div className="min-h-[300px]">
                {question.type === QuestionType.SCALE && renderScale()}
                {question.type === QuestionType.SINGLE && renderSingle()}
                {question.type === QuestionType.MULTIPLE && renderMulti()}
                {question.type === QuestionType.TEXT && renderText(false)}
                {question.type === QuestionType.TEXTAREA && renderText(true)}
            </div>
        </div>
    );
};

export default QuestionCard;
