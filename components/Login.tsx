import React, { useState } from 'react';
import { USERS, ADMIN_KEY } from '../constants';
import { UserProfile } from '../types';
import { dbService } from '../services/db';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin }) => {
  const [step, setStep] = useState<'PROFILE' | 'PIN' | 'RESUME'>('PROFILE');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  // Admin Mode State
  const [adminKey, setAdminKey] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  // --- Handlers ---

  const handleProfileSelect = (user: UserProfile) => {
    setSelectedUser(user);
    setStep('PIN');
    setError('');
    setPin('');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await dbService.auth(selectedUser.id, pin);
      if (res && res.success) {
        // Auth Success
        setHasProgress(res.hasProgress);
        if (res.hasProgress) {
          setStep('RESUME');
        } else {
          // No progress, straight in
          onLogin(res.user);
        }
      } else {
        setError('Wrong PIN. Try again calmly 🙂');
      }
    } catch (err) {
      setError('Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeConfirm = () => {
    if (selectedUser) onLogin(selectedUser);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow both env key and fallback for specific dev case
    if (adminKey === ADMIN_KEY || adminKey === "bS%83B4+4uAO-#&&UyK;H+") {
      onAdminLogin();
    } else {
      setError('Access Denied');
    }
  };

  // --- Render ---

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-darker p-8 rounded-2xl shadow-xl border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6 text-center uppercase tracking-widest">Admin Control</h2>
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <input
              type="password"
              className="w-full p-4 bg-brand-dark border border-brand-secondary/30 rounded-xl text-brand-accent placeholder-brand-secondary/50 focus:ring-2 focus:ring-brand-accent outline-none transition-all font-mono text-center tracking-widest"
              placeholder="SECURE KEY"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
            <button className="w-full py-4 bg-brand-secondary hover:bg-brand-primary text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-secondary/20 uppercase tracking-widest text-sm">
              Enter Dashboard
            </button>
            <button type="button" onClick={() => setShowAdmin(false)} className="w-full text-gray-500 text-xs hover:text-white transition-colors uppercase tracking-widest mt-2">Cancel Access</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/5 blur-[120px] rounded-full -z-10" />

      {/* Header Branding */}
      <div className="text-center mb-10 max-w-lg mx-auto animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
          JustWhy<span className="text-brand-accent italic">Us</span>
        </h1>
        <p className="text-brand-primary text-sm tracking-[0.3em] uppercase font-bold opacity-80">
          Team Evolution Insight Tool
        </p>
        <div className="h-px w-24 bg-brand-secondary/30 mx-auto mt-6" />
      </div>

      <div className="w-full max-w-4xl relative min-h-[400px]">

        {/* Step 1: Profile Picker */}
        {step === 'PROFILE' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 animate-fade-in-up">
            {USERS.map((user, i) => (
              <button
                key={user.id}
                onClick={() => handleProfileSelect(user)}
                className="group flex flex-col items-center justify-center p-8 bg-brand-darker border border-white/5 rounded-[40px] hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/5 hover:-translate-y-2 transition-all duration-500 aspect-square relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-20 h-20 rounded-3xl bg-brand-dark text-brand-primary flex items-center justify-center text-3xl font-black mb-4 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-500 shadow-xl group-hover:rotate-3">
                  {user.name.charAt(0)}
                </div>
                <span className="font-black text-gray-400 group-hover:text-white tracking-widest uppercase text-xs transition-colors">{user.name}</span>

                {/* Visual marker */}
                <div className="absolute bottom-4 w-12 h-1 bg-white/5 rounded-full group-hover:bg-brand-accent transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2: PIN Entry */}
        {step === 'PIN' && selectedUser && (
          <div className="max-w-md mx-auto bg-brand-darker p-12 rounded-[48px] shadow-3xl border border-white/5 animate-zoom-in relative">
            <button
              onClick={() => { setStep('PROFILE'); setError(''); }}
              className="absolute top-10 left-10 text-gray-500 hover:text-white transition-colors p-2"
              title="Back to Profiles"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="text-center mb-10">
              <div className="w-24 h-24 mx-auto bg-brand-dark rounded-3xl flex items-center justify-center text-5xl font-black text-brand-accent mb-6 shadow-2xl rotate-3">
                {selectedUser.name.charAt(0)}
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">{selectedUser.name}</h2>
              <p className="text-brand-primary/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Security Authorization</p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-8">
              <input
                autoFocus
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-4xl font-black tracking-[0.8em] py-6 bg-transparent border-b-2 border-brand-secondary/20 focus:border-brand-accent outline-none transition-all placeholder-white/5 text-brand-accent"
                placeholder="••••"
              />

              {error && (
                <div className="bg-red-950/20 text-red-400 border border-red-500/20 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !pin}
                className="w-full py-6 bg-brand-secondary hover:bg-brand-primary text-white font-black rounded-3xl transition-all shadow-xl hover:shadow-brand-secondary/20 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.3em] text-[10px]"
              >
                {isLoading ? 'Verifying Node...' : 'Access Terminal'}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Resume Confirmation */}
        {step === 'RESUME' && selectedUser && (
          <div className="max-w-md mx-auto bg-brand-darker p-12 rounded-[48px] shadow-3xl border border-white/5 animate-zoom-in text-center">
            <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>

            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Active Sync Found</h2>
            <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
              Your session is still active. Resume exactly where you stopped or start fresh.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleResumeConfirm}
                className="w-full py-6 bg-brand-accent text-brand-dark font-black rounded-3xl transition-all shadow-xl shadow-brand-accent/10 transform hover:-translate-y-1 uppercase tracking-[0.3em] text-[10px]"
              >
                Resume Assessment
              </button>
              <button
                onClick={handleResumeConfirm}
                className="w-full py-4 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                I want to continue
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer / Version */}
      <div className="fixed bottom-8 w-full flex flex-col items-center gap-4">
        <button
          onClick={() => setShowAdmin(true)}
          className="text-white/10 hover:text-brand-accent text-[10px] font-black uppercase tracking-[0.4em] transition-all"
        >
          Master Control
        </button>
        <div className="text-[8px] font-mono text-white/5 tracking-widest uppercase">System Edition v0.5.5 • Encrypted</div>
      </div>

      <style jsx global>{`
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.4s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>

    </div>
  );
};

export default Login;