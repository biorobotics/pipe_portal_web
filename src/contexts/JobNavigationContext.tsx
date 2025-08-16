/**
 * @fileoverview JobNavigationContext provides context and hooks for managing the selected JobNavLabel in the JobNavigationBar component.
 * Use JobNavigationProvider to wrap components and useJobNavigation to access or update the selected label.
 */
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';


/**
 * Type for the job navigation context value.
 * @property selectedJobLabel - The currently selected job navigation label.
 * @property setSelectedJobLabel - Function to update the selected label.
 */
interface JobNavigationContextType {
  selectedJobLabel: string;
  setSelectedJobLabel: (label: string) => void;
}


/**
 * React context for job navigation state.
 */
const JobNavigationContext = createContext<JobNavigationContextType | undefined>(undefined);


/**
 * Provider component for JobNavigationContext.
 * Wrap your component tree with this to provide job navigation state.
 * @param children - The child components to wrap with the provider.
 * @returns The provider with job navigation context.
 */
export function JobNavigationProvider({ children }: { children: ReactNode }) {
  const [selectedJobLabel, setSelectedJobLabel] = useState<string>('Data');

  return (
    <JobNavigationContext.Provider value={{ selectedJobLabel, setSelectedJobLabel }}>
      {children}
    </JobNavigationContext.Provider>
  );
}


/**
 * Custom hook to access the job navigation context.
 * Throws an error if used outside a JobNavigationProvider.
 * @returns The job navigation context value.
 */
export function useJobNavigation() {
  const context = useContext(JobNavigationContext);
  if (context === undefined) {
    throw new Error('useJobNavigation must be used within a JobNavigationProvider');
  }
  return context;
}