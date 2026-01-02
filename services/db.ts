import { UserProfile, Session, Answer, ActivityLog, Language } from '../types';
import { ADMIN_KEY } from '../constants';

const API_URL = '/api/v1';

async function api(action: string, payload: any = {}, secret?: string) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload, secret })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    console.error("DB Error", e);
    return null;
  }
}

export const dbService = {
  // --- Async Methods for Client Components ---

  auth: async (userId: string, pin: string) => {
    return await api('login_user', { userId, pin });
  },

  getUser: async (userId: string) => {
    const data = await api('get_user_data', { userId });
    return data; // returns { user, session, answers }
  },

  startOrResumeSession: async (userId: string) => {
    return await api('start_session', { userId });
  },

  updateUserLanguage: async (userId: string, language: Language) => {
    return await api('update_language', { userId, language });
  },

  saveAnswer: async (userId: string, questionId: number, section: string, answerText: string, timeSpent: number, currentIndex: number) => {
    return await api('save_progress', {
      userId, questionId, section, answerText, timeSpent, currentIndex
    });
  },

  heartbeat: async (userId: string) => {
    return await api('heartbeat', { userId });
  },

  logEvent: async (userId: string, event: 'backtrack' | 'blur') => {
    return await api('log_event', { userId, event });
  },

  completeSession: async (userId: string) => {
    return await api('complete_session', { userId });
  },

  // --- Admin ---

  getAdminStats: async () => {
    return await api('admin_stats', {}, ADMIN_KEY);
  },

  getAnswersByUser: async (userId: string) => {
    return await api('admin_get_answers', { userId }, ADMIN_KEY);
  },

  resetUserProgress: async (targetUserId: string, adminId: string) => {
    return await api('admin_reset', { targetUserId, adminId }, ADMIN_KEY);
  },

  resetSystem: async (adminId: string) => {
    return await api('admin_reset_system', { adminId }, ADMIN_KEY);
  },

  exportAllData: async () => {
    return await api('admin_export', {}, ADMIN_KEY);
  }
};