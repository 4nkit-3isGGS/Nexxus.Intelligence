import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService, DEMO_OFFICERS } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [officerRole, setOfficerRole] = useState(() => currentUser?.role || 'LEAD_INVESTIGATOR');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const isAuthenticated = Boolean(currentUser && currentUser.userId);

  // Sync state if localStorage changes across tabs or window events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'nexxus_officer_session') {
        const user = apiService.getCurrentUser();
        setCurrentUser(user);
        if (user) {
          setOfficerRole(user.role);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await apiService.login(credentials);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setOfficerRole(res.user.role);
      apiService.setOfficerClearance(res.user.role);
    }
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await apiService.register(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setOfficerRole(res.user.role);
      apiService.setOfficerClearance(res.user.role);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    apiService.logout();
    setCurrentUser(null);
  }, []);

  const updateRole = useCallback((role) => {
    setOfficerRole(role);
    const updated = apiService.setOfficerClearance(role);
    if (currentUser) {
      setCurrentUser(updated);
    }
    return updated;
  }, [currentUser]);

  const openAuthModal = useCallback((tab = 'login', options = {}) => {
    if (options.redirect) {
      try {
        sessionStorage.setItem('nexxus_pending_redirect', options.redirect);
      } catch (e) {}
    }
    if (options.query) {
      try {
        sessionStorage.setItem('nexxus_pending_query', options.query);
      } catch (e) {}
    }
    setAuthModalTab(tab);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const getPendingRedirect = useCallback(() => {
    try {
      return sessionStorage.getItem('nexxus_pending_redirect');
    } catch (e) {
      return null;
    }
  }, []);

  const getPendingQuery = useCallback(() => {
    try {
      return sessionStorage.getItem('nexxus_pending_query');
    } catch (e) {
      return null;
    }
  }, []);

  const clearPendingDirectives = useCallback(() => {
    try {
      sessionStorage.removeItem('nexxus_pending_redirect');
      sessionStorage.removeItem('nexxus_pending_query');
    } catch (e) {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        officerRole,
        setOfficerRole: updateRole,
        login,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        getPendingRedirect,
        getPendingQuery,
        clearPendingDirectives,
        demoOfficers: DEMO_OFFICERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback for components used outside provider or in tests
    const user = apiService.getCurrentUser();
    return {
      currentUser: user,
      isAuthenticated: Boolean(user && user.userId),
      officerRole: user?.role || 'LEAD_INVESTIGATOR',
      login: apiService.login,
      register: apiService.register,
      logout: apiService.logout,
      setOfficerRole: apiService.setOfficerClearance,
      showAuthModal: false,
      setShowAuthModal: () => {},
      authModalTab: 'login',
      setAuthModalTab: () => {},
      openAuthModal: () => {},
      closeAuthModal: () => {},
      getPendingRedirect: () => null,
      getPendingQuery: () => null,
      clearPendingDirectives: () => {},
      demoOfficers: DEMO_OFFICERS,
    };
  }
  return context;
}
