import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS } from '../constants';
import { UserProfile, Language, Session, Answer } from '../types';
import { dbService } from '../services/db';

interface Props {
  user: UserProfile;
  initialLanguage: Language;
}

const CompletionScreen: React.FC<{ user: UserProfile }> = ({ user }) => (
  <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center animate-fade-in border border-brand-secondary/10">
      <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-brand-darker mb-4">Thank you for your time and effort.</h1>
      
      <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
        <p>Your responses will help us improve and build this application better.</p>
        <p>The admin team will notify you once the analysis is completed.</p>
        <p className="font-medium text-brand-secondary">You can safely close this page.</p>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">JustWhyUs Team</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-gray-400 hover:text-brand-primary transition-colors underline"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

const Assessment: React.FC<Props> = ({ user, initialLanguage }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState<Language>(initialLanguage);
  const [isSaving, setIsSaving] = useState(false);
  
  const question = QUESTIONS[currentIndex];
  const startTimeRef = useRef<number>(Date.now());

  // Initial Load
  useEffect(() => {
    const init = async () => {
      // Fetch full data bundle
      const data = await dbService.getUser(user.id);
      
      let currentSession = data.session;
      if (!currentSession) {
         currentSession = await dbService.startOrResumeSession(user.id);
      }

      // Map answers
      const ansMap: Record<number, string> = {};
      if (data.answers) {
        data.answers.forEach((a: any) => {
          ansMap[a.questionId] = a.answerText;
        });
      }

      setSession(currentSession);
      if (currentSession) {
        setCurrentIndex(currentSession.currentIndex);
        if (data.user?.language) setCurrentLang(data.user.language);
      }
      setAnswers(ansMap);
      setLoading(false);
    };
    init();
  }, [user.id]);

  // --- Logic: Saving & Persistence ---

  const saveCurrentData = useCallback(async (force = false) => {
    if (!session || session.isCompleted) return;

    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000; // seconds
    const answerText = answers[question.id] || '';

    setIsSaving(true);
    
    // Save to DB (Single call handles answer + session update)
    await dbService.saveAnswer(user.id, question.id, question.section, answerText, elapsed, currentIndex);
    await dbService.updateUserLanguage(user.id, currentLang);

    // Reset timer
    startTimeRef.current = now;
    setIsSaving(false);
  }, [user.id, question, answers, currentIndex, currentLang, session]);

  // Debounce save while typing
  useEffect(() => {
    if (!session || session.isCompleted) return;
    const handler = setTimeout(() => {
      saveCurrentData();
    }, 2000); 
    return () => clearTimeout(handler);
  }, [answers[question?.id], saveCurrentData, session]);

  // Heartbeat
  useEffect(() => {
    if (!session || session.isCompleted) return;
    const hb = setInterval(() => dbService.heartbeat(user.id), 15000);
    return () => clearInterval(hb);
  }, [user.id, session]);

  // Clean up on unmount / change question
  useEffect(() => {
    if (!session || session.isCompleted) return;
    startTimeRef.current = Date.now();
    return () => {
      // Capture simple exit save if needed
    };
  }, [currentIndex, session]);

  // --- Handlers ---

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({ ...prev, [question.id]: e.target.value }));
  };

  const handleNext = async () => {
    await saveCurrentData(true);
    
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      await dbService.completeSession(user.id);
      setSession(prev => prev ? { ...prev, isCompleted: true } : null);
    }
  };

  const handlePrev = async () => {
    await saveCurrentData(true);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="animate-pulse text-brand-primary font-bold">Resuming Session...</div>
      </div>
    );
  }

  if (session?.isCompleted) {
    return <CompletionScreen user={user} />;
  }

  // --- UI Logic ---
  const getQuestionText = () => {
    if (!question) return "";
    if (currentLang === Language.AR && question.text.ar) return question.text.ar;
    if (currentLang === Language.FR && question.text.fr) return question.text.fr;
    return question.text.en;
  };

  const isRTL = currentLang === Language.AR;
  const progressPct = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const totalAnswered = Object.keys(answers).filter(k => answers[Number(k)]?.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-brand-surface text-brand-darker font-sans flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-brand-secondary/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-accent font-bold text-sm">
               JW
             </div>
             <div className="hidden sm:block">
                <div className="text-xs font-bold text-brand-secondary uppercase tracking-widest">JustWhyUs</div>
             </div>
          </div>

          <div className="flex bg-gray-100 rounded-full p-1">
            {[Language.EN, Language.FR, Language.AR].map(lang => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  currentLang === lang 
                    ? 'bg-white shadow text-brand-darker' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
               <div className="text-xs font-medium text-gray-900">{user.name}</div>
               <div className="text-[10px] text-brand-primary flex items-center justify-end gap-1">
                 {isSaving ? 'Saving...' : 'Online'}
                 <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
               </div>
             </div>
          </div>
        </div>
        
        <div className="h-1 w-full bg-gray-100">
          <div 
            className="h-full bg-brand-secondary transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-20 px-4 sm:px-6">
        <div className="w-full max-w-3xl">
          
          <div className="flex justify-between items-end mb-6 px-1">
            <span className="text-xs font-bold text-brand-primary tracking-widest uppercase bg-brand-primary/10 px-2 py-1 rounded">
              {question?.section}
            </span>
            <span className="text-xs font-medium text-gray-400 font-mono">
              {currentIndex + 1} <span className="text-gray-300">/</span> {QUESTIONS.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-brand-darker/5 border border-white overflow-hidden">
            
            <div className={`px-8 py-10 sm:px-12 sm:py-12 ${question?.isPuzzle ? 'bg-brand-primary/5' : ''}`}>
              {question?.isPuzzle && (
                <div className="mb-4 flex items-center gap-2 text-brand-secondary text-xs font-bold uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full border border-brand-secondary flex items-center justify-center">?</span>
                  Logic Puzzle
                </div>
              )}
              
              <h2 
                className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-brand-darker leading-tight sm:leading-snug transition-all duration-300 ${isRTL ? 'font-arabic text-right' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {getQuestionText()}
              </h2>
            </div>

            <div className="relative">
              <textarea
                value={answers[question?.id] || ''}
                onChange={handleTextChange}
                placeholder={isRTL ? "اكتب إجابتك بعناية هنا..." : "Type your answer thoughtfully here..."}
                className={`w-full h-80 sm:h-96 p-8 sm:px-12 bg-transparent text-lg text-gray-700 leading-relaxed resize-none focus:bg-brand-primary/5 outline-none transition-colors duration-300 placeholder-gray-300 ${isRTL ? 'text-right font-arabic' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
                spellCheck="false"
              />
            </div>

            <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="text-sm font-medium text-gray-400 hover:text-brand-dark transition-colors disabled:opacity-0"
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-3 bg-brand-dark text-white rounded-lg shadow-lg hover:shadow-brand-secondary/30 hover:bg-brand-secondary transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-medium"
              >
                <span>{currentIndex === QUESTIONS.length - 1 ? 'Finish Assessment' : 'Continue'}</span>
                <svg className="w-4 h-4 text-brand-accent group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;