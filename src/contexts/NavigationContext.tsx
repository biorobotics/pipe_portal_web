'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type IconType = 'job' | 'map' | 'bot';

interface NavigationContextType {
  selectedIcon: IconType;
  setSelectedIcon: (icon: IconType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [selectedIcon, setSelectedIcon] = useState<IconType>('job');

  return (
    <NavigationContext.Provider value={{ selectedIcon, setSelectedIcon }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 