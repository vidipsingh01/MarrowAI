'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <UIContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
