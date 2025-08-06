'use client';

import { useJobNavigation } from "../contexts/JobNavigationContext";
import JobNavLabels from "./JobNavLabels";

export default function JobNavigationBar() {
  const { selectedJobLabel, setSelectedJobLabel } = useJobNavigation();
  
  const jobLabels = ['Data', 'Observations', '3D', 'Metadata'];

  return (
    <div style={{
      background: 'transparent',
      padding: "0vh 0vh",
      border: `${(2/776*100).toFixed(3)}vh solid #C0C0C0`,
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