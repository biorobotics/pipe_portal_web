/**
 * @fileoverview JobNavigationBar component for displaying navigation tabs for a job.
 * Integrates with JobNavigationContext and renders JobNavLabels for navigation.
 * Uses client-side rendering.
 * @remark The JobNavigationContext provides the selected job label and setter.
 * The JobNavLabels component is used to render the navigation labels.
 */
'use client';

import { useJobNavigation } from "../contexts/JobNavigationContext";
import JobNavLabels from "./JobNavLabels";


/**
 * JobNavigationBar component for displaying navigation tabs for a job.
 * Uses JobNavigationContext to manage the selected tab and renders JobNavLabels.
 */
export default function JobNavigationBar() {
  /**
   * Selected job label and setter from context.
   */
  const { selectedJobLabel, setSelectedJobLabel } = useJobNavigation();
  /**
   * List of job navigation labels.
   */
  const jobLabels = ['Data', 'Observations', '3D', 'Metadata'];

  return (
    <div style={{
      background: 'transparent',
      padding: "0vh 0vh",
      border: "0.258vh solid #C0C0C0",
      zIndex: 1
    }}>
      <JobNavLabels 
        labels={jobLabels}
        selectedLabel={selectedJobLabel}
        onLabelClick={setSelectedJobLabel}
      />
    </div>
  );
}