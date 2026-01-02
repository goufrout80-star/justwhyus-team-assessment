import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Assessment from './components/Assessment';
import AdminDashboard from './components/AdminDashboard';
import LanguageSelector from './components/LanguageSelector';
import { UserProfile, UserRole, Language } from './types';
import { dbService } from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [appLang, setAppLang] = useState<Language>(Language.EN);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle successful user login
  const handleUserLogin = async (loggedInUser: UserProfile) => {
    setIsLoading(true);
    setUser(loggedInUser);

    try {
      // Fetch fresh data from server
      const data = await dbService.getUser(loggedInUser.id);

      if (data && data.user && data.user.language) {
        setAppLang(data.user.language as Language);
        setShowLangSelector(false);
      } else {
        setShowLangSelector(true);
      }
    } catch (e) {
      console.error("Failed to load user data");
      setShowLangSelector(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleLanguageSelect = (lang: Language) => {
    setAppLang(lang);
    if (user) {
      dbService.updateUserLanguage(user.id, lang);
    }
    setShowLangSelector(false);
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-darker flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-brand-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (!user) {
    return <Login onLogin={handleUserLogin} onAdminLogin={handleAdminLogin} />;
  }

  if (showLangSelector) {
    return <LanguageSelector onSelect={handleLanguageSelect} />;
  }

  return <Assessment user={user} initialLanguage={appLang} />;
};

export default App;