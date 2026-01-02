import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QUESTIONS } from '../constants';
import { UserProfile, Language, Session, QuestionType } from '../types';
import { dbService } from '../services/db';
import QuestionCard from './QuestionCard';

interface Props {
  user: UserProfile;
  initialLanguage: Language;
}

const CompletionScreen: React.FC<{ user: UserProfile }> = ({ user }) => (
  <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-brand-darker rounded-2xl shadow-2xl p-12 text-center animate-fade-in border border-brand-secondary/20">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">Thank you for your help.</h1>

      <div className="space-y-4 text-gray-400 leading-relaxed mb-8 text-lg">
        <p>Your responses have been saved securely.</p>
        <p>The admin team will notify you when the analysis is ready.</p>
        <p className="font-medium text-brand-primary">You can safely close this page.</p>
      </div>

      <div className="pt-8 border-t border-white/5">
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-gray-500 hover:text-white transition-colors underline"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

const Assessment: React.FC<Props> = ({ user, initialLanguage }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({}); // Changed to any to hold mixed types
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLang, setCurrentLang] = useState<Language>(initialLanguage);

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null);

  const question = QUESTIONS[currentIndex];
  const startTimeRef = useRef<number>(Date.now());

  // --- Helpers ---
  const parseAnswer = (val: string) => {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  const stringifyAnswer = (val: any) => {
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
  };

  const isValid = (q: any, val: any) => {
    if (val === undefined || val === null) return false;
    if (q.type === QuestionType.TEXT || q.type === QuestionType.TEXTAREA) return val.trim().length > 0;
    if (q.type === QuestionType.MULTIPLE) return Array.isArray(val) && val.length > 0;
    return true; // Scale/Single are valid if not null
  };

  // --- Initialization ---
  useEffect(() => {
    const init = async () => {
      try {
        const data = await dbService.getUser(user.id);

        if (!data) throw new Error("Connection failed");

        let currentSession = data.session;
        if (!currentSession) {
          currentSession = await dbService.startOrResumeSession(user.id);
        }

        const ansMap: Record<number, any> = {};
        if (data.answers) {
          data.answers.forEach((a: any) => {
            ansMap[a.questionId] = parseAnswer(a.answerText);
          });
        }

        setSession(currentSession);
        if (currentSession) {
          setCurrentIndex(currentSession.currentIndex);
          if (data.user?.language) setCurrentLang(data.user.language);
        }
        setAnswers(ansMap);
      } catch (err: any) {
        setError(err.message || "Failed to load assessment");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user.id]);

  // --- Real-Time Save Logic ---
  const saveImmediate = async (idx: number, val: any) => {
    if (!session || session.isCompleted) return;

    setIsSaving(true);
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000;

    try {
      await dbService.saveAnswer(
        user.id,
        QUESTIONS[idx].id,
        QUESTIONS[idx].section,
        stringifyAnswer(val),
        elapsed,
        idx
      );
      setLastSaved(now);
      startTimeRef.current = now; // Reset timer for next chunk
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswerChange = (val: any) => {
    const qId = question.id;
    setAnswers(prev => ({ ...prev, [qId]: val }));

    // Debounce Save
    if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current);
    pendingSaveRef.current = setTimeout(() => {
      saveImmediate(currentIndex, val);
    }, 500); // 500ms debounce
  };

  // Cleanup on unmount/index change
  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current);
    };
  }, [currentIndex]);

  // --- Navigation ---
  const handleNext = async () => {
    // Force final save before moving
    if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current);
    await saveImmediate(currentIndex, answers[question.id]);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      await dbService.completeSession(user.id);
      setSession(prev => prev ? { ...prev, isCompleted: true } : null);
    }
  };

  const handleSkip = async () => {
    if (pendingSaveRef.current) clearTimeout(pendingSaveRef.current);
    // Save current state even if empty/partial
    await saveImmediate(currentIndex, answers[question.id]);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (user) dbService.logEvent(user.id, 'backtrack');
      setCurrentIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // --- Render ---

  if (loading) return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-primary">Loading...</div>;
  if (error) return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-brand-darker p-8 rounded-xl border border-red-500 text-center">
        <h2 className="text-xl text-white mb-2">Error</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-brand-primary text-white rounded">Retry</button>
      </div>
    </div>
  );
  if (session?.isCompleted) return <CompletionScreen user={user} />;

  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);
  const currentVal = answers[question.id];
  const canProceed = isValid(question, currentVal);

  return (
    <div className="min-h-screen bg-brand-darker text-gray-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-brand-secondary flex items-center justify-center text-brand-dark font-bold">JW</div>
            <span className="hidden sm:inline font-bold text-gray-400 text-sm tracking-widest">ASSESSMENT</span>
          </div>

          <div className="flex gap-2">
            {[Language.EN, Language.FR, Language.AR].map(l => (
              <button key={l} onClick={() => setCurrentLang(l)} className={`px-2 py-1 text-xs rounded uppercase font-bold transition-all ${currentLang === l ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-gray-500">
            {isSaving ? <span className="text-yellow-500">Saving...</span> : <span>Saved</span>}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-800 w-full">
          <div className="h-full bg-brand-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-end mb-8">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-1 rounded">
              {question.section}
            </span>
            <span className="text-4xl font-light text-white/20 font-mono">
              {currentIndex + 1}<span className="text-base text-white/10">/{QUESTIONS.length}</span>
            </span>
          </div>

          <QuestionCard
            question={question}
            value={currentVal}
            onChange={handleAnswerChange}
            language={currentLang}
          />

          {/* Controls */}
          <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 text-gray-500 hover:text-white transition-colors disabled:opacity-0 font-medium text-sm"
            >
              Previous
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-gray-500 hover:text-brand-primary transition-colors text-sm font-medium"
              >
                Skip for now
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-3 bg-brand-primary text-white rounded-lg font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary hover:shadow-brand-secondary/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {currentIndex === QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Assessment;