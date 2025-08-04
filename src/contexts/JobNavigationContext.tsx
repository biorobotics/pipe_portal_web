'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface JobNavigationContextType {
  selectedJobLabel: string;
  setSelectedJobLabel: (label: string) => void;
}

const JobNavigationContext = createContext<JobNavigationContextType | undefined>(undefined);

export function JobNavigationProvider({ children }: { children: ReactNode }) {
  const [selectedJobLabel, setSelectedJobLabel] = useState<string>('Data');

  return (
    <JobNavigationContext.Provider value={{ selectedJobLabel, setSelectedJobLabel }}>
      {children}
    </JobNavigationContext.Provider>
  );
}

export function useJobNavigation() {
  const context = useContext(JobNavigationContext);
  if (context === undefined) {
    throw new Error('useJobNavigation must be used within a JobNavigationProvider');
  }
  return context;
} 