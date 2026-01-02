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
    if (adminKey === ADMIN_KEY) {
      onAdminLogin();
    } else {
      setError('Access Denied.');
    }
  };

  // --- Admin View ---
  if (isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-darker text-white p-4 font-sans">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-brand-dark p-8 rounded-xl shadow-2xl border border-brand-secondary/30">
            <h2 className="text-xl font-bold text-brand-accent mb-6 text-center tracking-widest uppercase">
              System Control
            </h2>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-brand-darker border border-brand-secondary text-brand-accent placeholder-brand-secondary/50 rounded focus:outline-none focus:border-brand-accent transition-colors text-center tracking-widest"
                  placeholder="SECURE KEY"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-brand-secondary hover:bg-brand-primary text-white font-medium rounded transition-all duration-300"
              >
                ACCESS DASHBOARD
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdminMode(false)}
                className="w-full text-center text-xs text-brand-primary hover:text-white transition-colors mt-4"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- User View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4 font-sans">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">JustWhyUs</h1>
          <p className="text-brand-secondary text-sm tracking-widest uppercase font-medium">Team Assessment Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form className="space-y-6" onSubmit={handleUserLogin}>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider">Identity</label>
              <div className="relative">
                <select
                  required
                  className="block w-full px-4 py-4 bg-brand-surface border-none text-brand-darker rounded-lg appearance-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all font-medium text-lg"
                  value={selectedUser}
                  onChange={(e) => {
                      setSelectedUser(e.target.value);
                      setError('');
                  }}
                >
                  <option value="">Select your profile...</option>
                  {USERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-secondary uppercase tracking-wider">Secure PIN</label>
              <input
                type="password"
                required
                className="block w-full px-4 py-4 bg-brand-surface border-none text-brand-darker rounded-lg focus:ring-2 focus:ring-brand-accent focus:bg-white transition-all font-medium text-lg placeholder-gray-400"
                placeholder="••••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedUser || !pin}
              className="w-full py-4 px-6 bg-brand-dark text-white text-lg font-semibold rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
            >
              Begin Session
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <button 
              onClick={() => setIsAdminMode(true)}
              className="text-xs font-medium text-gray-400 hover:text-brand-secondary transition-colors"
            >
              System Administration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;