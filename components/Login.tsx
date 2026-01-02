import React, { useState } from 'react';
import { USERS, ADMIN_KEY } from '../constants';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pin, setPin] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState('');

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.id === selectedUser);
    if (user && user.pin === pin.trim()) {
      onLogin(user);
    } else {
      setError('Invalid PIN.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === ADMIN_KEY || adminKey === "bS%83B4+4uAO-#&&UyK;H+") {
      onAdminLogin();
    } else {
      setError('Access Denied.');
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darker text-white p-4 font-sans relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-md animate-fade-in relative">
          <div className="bg-[#0c0c0c] p-10 rounded-[40px] shadow-2xl border border-white/5 ring-1 ring-white/10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-brand-secondary flex items-center justify-center shadow-lg shadow-brand-secondary/20 rotate-3">
                <svg className="w-8 h-8 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 text-center tracking-tight">Master Control</h2>
            <p className="text-gray-500 text-center text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Authorization Key Required</p>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input
                type="password"
                required
                className="w-full px-6 py-4 bg-black/40 border border-white/10 text-brand-accent placeholder-white/5 rounded-2xl focus:outline-none focus:border-brand-accent transition-all text-center tracking-[0.5em] text-xl font-bold font-mono"
                placeholder="••••••••"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
              {error && <p className="text-red-400 text-[10px] text-center font-bold tracking-widest uppercase animate-shake">{error}</p>}
              <button
                type="submit"
                className="w-full py-4 bg-brand-secondary hover:bg-brand-primary text-brand-dark font-black rounded-2xl transition-all duration-300 shadow-xl shadow-brand-secondary/20 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[10px]"
              >
                Access Terminal
              </button>
              <button
                type="button"
                onClick={() => setIsAdminMode(false)}
                className="w-full text-center text-[10px] font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
              >
                Back to Personal Entry
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4 font-sans relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-4xl relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 tracking-[0.4em] uppercase">Intelligence Terminal v2.1</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            JUSTWHY<span className="text-brand-primary italic">US</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: User Selection Grid */}
          <div className="lg:col-span-12">
            <div className="bg-brand-dark/40 backdrop-blur-3xl rounded-[48px] shadow-2xl p-8 md:p-12 border border-white/5 ring-1 ring-white/10 animate-fade-in relative overflow-hidden">
              <div className="mb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">Candidate Selection</h2>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Identify yourself to continue</p>
                </div>
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="text-[10px] font-black text-gray-600 hover:text-brand-primary transition-all uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
                >
                  Admin System
                </button>
              </div>

              {/* Profiles Scrollable Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar max-h-[400px]">
                {USERS.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setSelectedUser(u.id); setError(''); }}
                    className={`relative flex flex-col items-center p-6 rounded-[32px] border transition-all duration-500 group ${selectedUser === u.id
                        ? 'bg-brand-primary/20 border-brand-primary shadow-lg shadow-brand-primary/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-2xl font-black transition-all duration-500 ${selectedUser === u.id
                        ? 'bg-brand-primary text-white scale-110'
                        : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'
                      }`}>
                      {u.name[0]}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${selectedUser === u.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {u.name}
                    </span>
                    {selectedUser === u.id && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                    )}
                  </button>
                ))}
              </div>

              {/* PIN Entry (Conditional) */}
              <div className={`transition-all duration-700 overflow-hidden ${selectedUser ? 'max-h-[300px] opacity-100 mt-10' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-4">Enter Personal PIN</h3>
                    <form onSubmit={handleUserLogin} className="space-y-6">
                      <input
                        type="password"
                        required
                        maxLength={10}
                        className="block w-full px-8 py-5 bg-black/40 border border-white/10 text-white rounded-[24px] focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-black text-3xl tracking-[0.5em] text-center placeholder-white/5"
                        placeholder="••••"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                      />
                      {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest animate-shake">{error}</p>}
                      <button
                        type="submit"
                        className="w-full py-5 bg-brand-primary hover:bg-brand-secondary text-white font-black rounded-[24px] transition-all duration-300 shadow-2xl shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                      >
                        Initialize Secure Session
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {!selectedUser && (
                <div className="py-10 text-center border-t border-white/5 animate-pulse">
                  <span className="text-xs text-gray-600 font-mono tracking-widest uppercase">Waiting for Identifier selection...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[9px] text-gray-700 font-mono tracking-[0.5em] uppercase opacity-40">Operational Terminal // Restricted Access // 2026</p>
      </div>

      <style jsx global>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-6px); }
                75% { transform: translateX(6px); }
            }
            .animate-shake {
                animation: shake 0.2s ease-in-out 0s 2;
            }
            .custom-scrollbar::-webkit-scrollbar {
                height: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 112, 243, 0.2);
                border-radius: 10px;
            }
        `}</style>
    </div>
  );
};

export default Login;
