'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface AdminContextType {
  isAdminMode: boolean;
  isAdminSidebarOpen: boolean;
  setIsAdminMode: (mode: boolean) => void;
  setIsAdminSidebarOpen: (isOpen: boolean) => void;
  toggleAdminSidebar: () => void;
  hasAdminPrivileges: boolean;
  catalogVersion: number;
  triggerCatalogRefresh: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [catalogVersion, setCatalogVersion] = useState(0);
  
  const hasAdminPrivileges = isLoaded && user?.publicMetadata?.role === 'admin';

  // Automatically turn off admin mode if user logs out or privileges change
  useEffect(() => {
    if (!hasAdminPrivileges) {
      setIsAdminMode(false);
      setIsAdminSidebarOpen(false);
    }
  }, [hasAdminPrivileges]);

  // Keep admin mode state persisted in localStorage for convenience
  useEffect(() => {
    if (hasAdminPrivileges) {
      const savedMode = localStorage.getItem('eternalsAdminMode') === 'true';
      setIsAdminMode(savedMode);
    }
  }, [hasAdminPrivileges]);

  const updateAdminMode = (mode: boolean) => {
    setIsAdminMode(mode);
    localStorage.setItem('eternalsAdminMode', String(mode));
  };

  const toggleAdminSidebar = () => {
    setIsAdminSidebarOpen((prev) => !prev);
  };

  const triggerCatalogRefresh = () => {
    setCatalogVersion((prev) => prev + 1);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminMode,
        isAdminSidebarOpen,
        setIsAdminMode: updateAdminMode,
        setIsAdminSidebarOpen,
        toggleAdminSidebar,
        hasAdminPrivileges,
        catalogVersion,
        triggerCatalogRefresh,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
