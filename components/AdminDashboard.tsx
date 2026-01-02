import React, { useEffect, useState, useMemo } from 'react';
import { dbService } from '../services/db';
import { UserProfile, Session, Answer } from '../types';
import { QUESTIONS, ADMIN_KEY } from '../constants';

interface UserStats {
  user: UserProfile;
  session: Session | null;
  answerCount: number;
  isOnline: boolean;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Reset Modals State
  const [resetTargetUser, setResetTargetUser] = useState<string | null>(null);
  const [showSystemReset, setShowSystemReset] = useState(false);
  const [confirmKey, setConfirmKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Poll for real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      const data = await dbService.getAdminStats();
      if (data) setStats(data);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  // Fetch answers when user selected
  useEffect(() => {
    const fetchAnswers = async () => {
      if (selectedUserId) {
        const data = await dbService.getAnswersByUser(selectedUserId);
        if (data) setAnswers(data);
      }
    };
    fetchAnswers();
  }, [selectedUserId]);

  const focusStats = stats.find(s => s.user.id === selectedUserId);

  // Psychometric Calculations (The New Functions)
  const psychMetrics = useMemo(() => {
    if (!focusStats || !focusStats.session) return null;
    const s = focusStats.session as any;
    const totalTime = s.totalTimeSpent || 1;
    const efficiency = Math.round((focusStats.answerCount / (totalTime / 60)) * 10) / 10;

    return {
      efficiency,
      distraction: s.blurCount || 0,
      reconsideration: s.backtrackCount || 0,
      sessions: s.loginCount || 1,
      sectionTimes: s.sectionTimes || {}
    };
  }, [focusStats]);

  // --- Handlers ---

  const handleResetUser = async () => {
    if (confirmKey !== ADMIN_KEY) {
      setErrorMsg('Invalid Admin Key');
      return;
    }
    if (resetTargetUser) {
      await dbService.resetUserProgress(resetTargetUser, 'ADMIN');
      setResetTargetUser(null);
      setConfirmKey('');
      setErrorMsg('');
      if (selectedUserId === resetTargetUser) {
        setAnswers([]);
      }
      const data = await dbService.getAdminStats();
      if (data) setStats(data);
    }
  };

  const handleSystemReset = async () => {
    if (confirmKey !== ADMIN_KEY) {
      setErrorMsg('Invalid Admin Key');
      return;
    }
    await dbService.resetSystem('ADMIN');
    setShowSystemReset(false);
    setConfirmKey('');
    setErrorMsg('');
    setSelectedUserId(null);
    setAnswers([]);
    const data = await dbService.getAdminStats();
    if (data) setStats(data);
  };

  const handleExportData = async () => {
    const data = await dbService.exportAllData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `justwhyus_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker text-gray-200 font-sans flex flex-col h-screen overflow-hidden relative">

      {/* --- MODALS --- */}
      {(resetTargetUser || showSystemReset) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-brand-secondary rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4">
              {showSystemReset ? 'DANGER: SYSTEM RESET' : 'Confirm User Reset'}
            </h3>

            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              {showSystemReset
                ? "This will delete ALL sessions, answers, and logs for ALL users. This action cannot be undone."
                : "This will wipe all progress, answers, and timers for the selected user."}
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-brand-primary uppercase mb-2">Admin Key Required</label>
              <input
                type="password"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                className="w-full bg-brand-darker border border-brand-secondary/50 rounded p-3 text-white focus:border-brand-accent focus:outline-none"
                placeholder="Enter Secure Key"
              />
              {errorMsg && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setResetTargetUser(null);
                  setShowSystemReset(false);
                  setConfirmKey('');
                  setErrorMsg('');
                }}
                className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={showSystemReset ? handleSystemReset : handleResetUser}
                className={`px-4 py-2 rounded text-white font-bold shadow-lg text-sm ${showSystemReset ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-secondary hover:bg-brand-primary'}`}
              >
                {showSystemReset ? 'NUKE SYSTEM' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-brand-dark border-b border-white/5 p-4 shrink-0">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <h1 className="text-lg font-bold tracking-widest text-white uppercase">Live Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportData}
              className="text-[10px] font-bold bg-white/5 hover:bg-brand-primary/20 px-3 py-1 rounded text-white transition-colors border border-white/10"
            >
              EXPORT JSON
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar: Users */}
        <aside className="w-80 border-r border-white/5 bg-brand-darker flex flex-col overflow-y-auto">
          {/* System Controls */}
          <div className="p-4 border-b border-white/5 bg-red-900/10 text-center">
            <button
              onClick={() => setShowSystemReset(true)}
              className="w-full py-2 px-3 bg-red-900/30 border border-red-900/50 hover:bg-red-900/50 text-red-200 text-[10px] rounded transition-colors font-bold uppercase tracking-widest"
            >
              ⚠ SYSTEM RESET
            </button>
          </div>

          <div className="p-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest mb-4">Active Personnel</h2>
            <div className="space-y-2">
              {stats.map(s => (
                <div
                  key={s.user.id}
                  onClick={() => setSelectedUserId(s.user.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedUserId === s.user.id
                    ? 'bg-brand-primary/20 border-brand-accent'
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-bold ${selectedUserId === s.user.id ? 'text-brand-accent' : 'text-gray-300'}`}>
                      {s.user.name}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${s.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.isOnline ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      <span>{s.isOnline ? 'LIVE' : 'IDLE'}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-1000 ${s.session?.isCompleted ? 'bg-green-500' : 'bg-brand-primary'}`}
                      style={{ width: `${(s.answerCount / QUESTIONS.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500 font-mono items-center">
                    <span>{Math.round((s.answerCount / QUESTIONS.length) * 100)}% Complete</span>
                    {s.session?.isCompleted && <span className="text-green-400 font-bold">DONE</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Panel: Data */}
        <main className="flex-1 bg-brand-dark/50 p-6 overflow-y-auto">
          {focusStats ? (
            <div className="max-w-4xl mx-auto space-y-6">

              {/* Header Card */}
              <div className="bg-brand-darker p-6 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    {focusStats.user.name}
                    {focusStats.session?.isCompleted && (
                      <span className="text-xs bg-green-500 text-brand-darker px-2 py-1 rounded font-bold uppercase">Completed</span>
                    )}
                  </h2>
                  <p className="text-xs text-brand-primary font-mono uppercase">
                    ID: {focusStats.user.id} • Lang: {focusStats.user.language || 'EN'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-light text-brand-accent font-mono">
                      {focusStats.answerCount}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Logged</div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setResetTargetUser(focusStats.user.id); }}
                    className="ml-4 px-3 py-2 bg-white/5 hover:bg-red-900/50 border border-white/10 hover:border-red-500/50 text-gray-400 hover:text-red-300 rounded text-xs transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Psychology Metrics (Enhanced UI in Old Layout) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-darker border border-white/5 p-4 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Efficiency</div>
                  <div className="text-xl font-bold text-brand-primary">{psychMetrics?.efficiency} <span className="text-[10px]">A/m</span></div>
                </div>
                <div className="bg-brand-darker border border-white/5 p-4 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Distractions</div>
                  <div className="text-xl font-bold text-yellow-500">{psychMetrics?.distraction}</div>
                </div>
                <div className="bg-brand-darker border border-white/5 p-4 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Backtracks</div>
                  <div className="text-xl font-bold text-blue-500">{psychMetrics?.reconsideration}</div>
                </div>
                <div className="bg-brand-darker border border-white/5 p-4 rounded-lg">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Logins</div>
                  <div className="text-xl font-bold text-green-500">{psychMetrics?.sessions}</div>
                </div>
              </div>

              {/* Answers Feed */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Submission Log</h3>

                {answers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-lg">
                    No data submitted yet.
                  </div>
                ) : (
                  QUESTIONS.map((q) => {
                    const ans = answers.find(a => a.questionId === q.id);
                    if (!ans) return null;

                    return (
                      <div key={q.id} className="bg-brand-darker p-5 rounded-lg border border-white/5 hover:border-brand-primary/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 px-2 py-1 rounded">
                            {q.section}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {Math.round(ans.timeSpent)}s spent
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-3 italic">
                          {q.text.en}
                        </p>

                        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed border-l-2 border-brand-accent pl-4 font-mono text-sm">
                          {(() => {
                            try {
                              const parsed = JSON.parse(ans.answerText);
                              if (Array.isArray(parsed)) return parsed.join(', '); // Multi-choice
                              if (typeof parsed === 'object') return JSON.stringify(parsed, null, 2);
                              return String(parsed);
                            } catch {
                              return ans.answerText;
                            }
                          })()}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p>Select a team member to view live data.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;