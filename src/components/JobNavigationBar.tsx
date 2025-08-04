'use client';

import { useJobNavigation } from "../contexts/JobNavigationContext";
import JobNavLabels from "./JobNavLabels";

export default function JobNavigationBar() {
  const { selectedJobLabel, setSelectedJobLabel } = useJobNavigation();
  
  const jobLabels = ['Data', 'Observations', '3D', 'Metadata'];

  return (
    <div style={{
      background: 'transparent',
      padding: "0px 0px",
      border: '2px solid #C0C0C0'
    }}>
      <JobNavLabels 
        labels={jobLabels}
        selectedLabel={selectedJobLabel}
        onLabelClick={setSelectedJobLabel}
      />
    </div>
  );
} 