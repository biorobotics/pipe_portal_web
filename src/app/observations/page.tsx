'use client';

import BackButton from "../../components/BackButton";
import JobNavigationBar from "../../components/JobNavigationBar";
import AddButton from "../../components/AddButton";
import WorkOrderExplorer from "../../components/WorkOrderExplorer";
import EntityButton from "../../components/EntityButton";
import { JobNavigationProvider, useJobNavigation } from "../../contexts/JobNavigationContext";
import React from "react";

export default function ObservationsPage() {
  return (
    <JobNavigationProvider>
      <ObservationsPageContent />
    </JobNavigationProvider>
  );
}

function ObservationsPageContent() {
  const { setSelectedJobLabel } = useJobNavigation();
  
  // Set Observations as selected when component mounts
  React.useEffect(() => {
    setSelectedJobLabel('Observations');
  }, [setSelectedJobLabel]);

  return (
    <div style={{
      marginLeft: "96px", // Account for the left sidebar
      minHeight: "calc(100vh - 64px)",
      background: "#EAEAEA",
      position: "relative"
    }}>
      {/* Navigation area with proper spacing */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px'
      }}>
        <BackButton />
        <JobNavigationBar />
      </div>
      
      {/* Work Order Explorer - positioned underneath back button */}
      <div style={{
        position: 'absolute',
        top: '40px', // Position underneath back button
        left: '0px',
        zIndex: 5
      }}>
        <WorkOrderExplorer 
          onWorkOrderSelect={(workOrderId) => {
            console.log('Selected work order:', workOrderId);
          }}
          onJobSelect={(jobId) => {
            console.log('Selected job:', jobId);
          }}
        />
      </div>
      
      {/* Entity Buttons Section - below work order explorer */}
      <div style={{
        position: 'absolute',
        top: 'calc(40px + 70vh)', // Position below work order explorer
        left: '0px',
        width: '264px', // Same width as work order explorer
        height: 'calc(100vh - 64px - 40px - 70vh)', // Fill remaining viewport height
        background: '#484848', // Match the new color scheme
        borderLeft: '2px solid #7C7C7C',
        zIndex: 5
      }}>
        {/* Separator line */}
        <div style={{
          height: '1px',
          background: '#c0c0c0',
          width: '100%'
        }} />
        
        {/* Entity Buttons */}
        <div style={{
          padding: '8px 0px',
          height: 'calc(100% - 1px)', // Fill remaining height after separator
          overflow: 'hidden', // Prevent scrollbar
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px' // Add more spacing between buttons
        }}>
          <EntityButton 
            label="Pipe" 
            entityId="PIPE-001" 
            onClick={() => {
              console.log('Navigate to pipe PIPE-001');
              // Custom navigation logic can be added here
            }}
          />
          <EntityButton 
            label="Robot" 
            entityId="ROBOT-ALPHA" 
            onClick={() => {
              console.log('Navigate to robot ROBOT-ALPHA');
              // Custom navigation logic can be added here
            }}
          />
        </div>
      </div>
      
      {/* Add Observation Button in top right corner */}
      <div style={{
        position: 'absolute',
        top: '4px',
        right: '8px'
      }}>
        <AddButton 
          text="Add Observation"
          fontFamily="Roboto Mono, monospace"
          fontWeight="400"
        />
      </div>
      
      {/* Main content area with left margin to account for work order explorer */}
      <div style={{
        padding: "20px",
        paddingTop: "40px", // Add top padding to avoid intersection with navigation
        marginLeft: "264px", // Account for work order explorer width
        color: "#242424",
        fontFamily: "var(--font-roboto), Roboto, Arial, sans-serif"
      }}>
        {/* Space reserved for videos and line graph */}
      </div>
    </div>
  );
} 