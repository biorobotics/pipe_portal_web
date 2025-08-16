/**
 * @fileoverview NavigationContext provides context and hooks for managing the selected navigation icon in the left nav bar.
 * Use NavigationProvider to wrap components and useNavigation to access or update the selected icon.
 */
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Type for navigation icon names.
 */
type IconType = 'job' | 'map' | 'bot';

/**
 * Type for the navigation context value.
 * @property selectedIcon - The currently selected navigation icon.
 * @property setSelectedIcon - Function to update the selected icon.
 */
interface NavigationContextType {
  selectedIcon: IconType;
  setSelectedIcon: (icon: IconType) => void;
}


/**
 * React context for navigation state.
 */
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Provider component for NavigationContext.
 * Wrap your component tree with this to provide navigation state.
 * @param children - The child components to wrap with the provider.
 * @returns The provider with navigation context.
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [selectedIcon, setSelectedIcon] = useState<IconType>('job');

  return (
    <NavigationContext.Provider value={{ selectedIcon, setSelectedIcon }}>
      {children}
    </NavigationContext.Provider>
  );
}


/**
 * Custom hook to access the navigation context.
 * Throws an error if used outside a NavigationProvider.
 * @returns The navigation context value.
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}