/**
 * @fileoverview Main content of the home page.
 * Contains navigation, work order explorer, entity buttons, data section, observations gallery, video monitoring, and video player.
 * Uses JobNavigationContext for managing job selection and VideoContext for video playback.
 * Provides a comprehensive overview of job-related data and observations.
 */

'use client';

import { useState } from "react";
import BackButton from "../components/BackButton";
import JobNavigationBar from "../components/JobNavigationBar";
import AddButton from "../components/AddButton";
import WorkOrderExplorer from "../components/WorkOrderExplorer";
import EntityButton from "../components/EntityButton";
import DataSection from "../components/DataSection";
import ObservationsGallery from "../components/ObservationsGallery";
import VideoPanel from "../components/VideoPanel";
import LineGraph from "../components/LineGraph";
import VideoPlayer from "../components/VideoPlayer";
import ObservationModal from "../components/ObservationModal";
import { JobNavigationProvider } from "../contexts/JobNavigationContext";
import { VideoProvider, useVideo } from "../contexts/VideoContext";
import Video  from 'next-video';

/** 
 * Main content of the home page, which is currently the job data page.
 * @returns - The main content of the home page
 */
function HomeContent() {
  const { 
    currentTime, 
    totalDuration, 
    observations, 
    highlightedObservation,
    currentData,
    graphData,
    setCurrentTime, 
    setHighlightedObservation,
    formatTime 
  } = useVideo();

  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false); // Modal state for adding new observations

  // Convert observations to the format expected by ObservationsGallery
  const sampleObservations = observations.map(obs => ({
    id: obs.id,
    title: obs.title,
    subtitle: obs.subtitle,
    timestamp: obs.timestamp,
    thumbnailUrl: obs.thumbnailUrl
  }));

  /**
   * Update the current time.
   * @param time - The time to set as the current time in the video player
   * @returns - Function to handle time change in the video player
   */
  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  /**
   * Sets current time to the time of the clicked observation and highlights it in the gallery.
   * @param observationId - The ID of the observation to highlight
   * @returns - Function to handle observation click in the gallery
   */
  const handleObservationClick = (observationId: string) => {
    const observation = observations.find(obs => obs.id === observationId);
    if (observation) {
      setCurrentTime(observation.time);
      setHighlightedObservation(observationId);
    }
  };

  /**
   * Handles adding a new observation when the Add Observation button is clicked.
   * Opens the observation modal for user input.
   * @returns - Function to handle adding a new observation
   */
  const handleAddObservation = () => {
    setIsObservationModalOpen(true);
  };

  /**
   * Saves and stores a new observation. Called when the user submits the observation modal.
   * Logs the observation data to the console for now.
   * In the future, this would save the observation to a database, likely in AWS
   * @param observationData - The data of the new observation to be added
   * @returns - Function to handle submission of a new observation
   */
  const handleObservationSubmit = (observationData: any) => {
    console.log('New observation:', observationData);
    // Here you would typically save the observation to your data store
    // For now, we'll just log it
  };

  return (
    <div style={{
      marginLeft: `${(96/1536*100).toFixed(3)}vw`, // Account for the left sidebar
      minHeight: `calc(100vh - ${(64/776*100).toFixed(3)}vh)`, // Conversion from px to vh, in this case we're converting 64px to vh
      background: "#EAEAEA",
      position: "relative"
    }}>

      {/* Navigation area with proper spacing */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'flex-end',
        gap: `${(8/1536*100).toFixed(3)}vw` // Converting 8px to vw
      }}>
        <BackButton />
        <JobNavigationBar />
      </div>
      
      {/* Work Order Explorer - positioned underneath back button */}
      <div style={{
        position: 'absolute',
        top: `${(40/776*100).toFixed(3)}vh`, // Position underneath back button
        left: '0vw',
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
        top: `calc(${(40/776*100).toFixed(3)}vh + 70vh)`,
        left: '0vw',
        width: `${(264/1536*100).toFixed(3)}vw`,
        height: `calc(100vh - ${(64/776*100).toFixed(3)}vh - ${(40/776*100).toFixed(3)}vh - 70vh)`, // Fill remaining viewport height
        background: '#484848',
        borderLeft: `${(2/1536*100).toFixed(3)}vw solid #7C7C7C`,
        zIndex: 5
      }}>
        {/* Separator line */}
        <div style={{
          height: `${(1/776*100).toFixed(3)}vh`,
          background: '#c0c0c0',
          width: '100%'
        }} />
        
        {/* Entity Buttons */}
        <div style={{
          padding: `${(8/776*100).toFixed(3)}vh 0`,
          height: `calc(100% - 0.129vh)`, // Fill remaining height after separator
          overflow: 'hidden', // Prevent scrollbar
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: `${(16/1536*100).toFixed(3)}vw` 
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
        top: `${(4/776*100).toFixed(3)}vh`,
        right: `${(12/1536*100).toFixed(3)}vw`
      }}>
        <AddButton 
          text="Add Observation"
          fontFamily="Roboto Mono, monospace"
          fontWeight="400"
          onClick={handleAddObservation} // Open flow menu on click
        />
      </div>
      
      {/* Data Section - positioned in main content area */}
      <div style={{
        position: 'absolute',
        top: `${(48/776*100).toFixed(3)}vh`, // Position below job nav bar
        left: `${(272/1536*100).toFixed(3)}vw`, // Position to the right of work order explorer, same margin as job nav bar
        zIndex: 4
      }}>
        <DataSection 
          latitude={currentData.latitude}
          longitude={currentData.longitude}
          altitude={currentData.altitude}
          pipeDiameter={currentData.pipeDiameter}
        />
      </div>
      {/* Observations Gallery - positioned below Data Section */}
      <div style={{
        position: 'absolute',
        top: `calc(${(48/776*100).toFixed(3)}vh + calc(35vh - ${(40/776*100).toFixed(3)}vh) + ${(8/776*100).toFixed(3)}vh)`, // Position below Data Section with new height
        left: `${(272/1536*100).toFixed(3)}vw`, // Same left margin as Data Section
        zIndex: 4
      }}>
        <ObservationsGallery 
          observations={sampleObservations} 
          highlightedObservation={highlightedObservation}
          onObservationClick={handleObservationClick}
        />
      </div>
      {/* Video Monitoring Section - positioned to the right of data section */}
      <div style={{
        position: 'absolute',
        top: `${(48/776*100).toFixed(3)}vh`,
        left: `calc(${(272/1536*100).toFixed(3)}vw + ${(280/1536*100).toFixed(3)}vw + ${(12/1536*100).toFixed(3)}vw)`, // Right of data section
        right: `${(12/1536*100).toFixed(3)}vw`, 
        bottom: `${(140/776*100).toFixed(3)}vh`, // Space for video player
        zIndex: 4
      }}>
        {/* Top row - Cam 1 and Cam 2 */}
        <div style={{
          display: 'flex',
          gap: `${(8/1536*100).toFixed(3)}vw`,
          marginBottom: `${(8/776*100).toFixed(3)}vh`,
          height: `${(334/776*100).toFixed(3)}vh`
        }}>
          <div style={{ flex: 1 }}>
            <VideoPanel
              vidFile="visual_output.mp4" 
              timestamp={formatTime(currentTime)}
              width="100%"
              height="100%"
            />
          </div>
          <div style={{ flex: 1 }}>
            <VideoPanel
              vidFile="laser_output.mp4" 
              timestamp={formatTime(currentTime)}
              width="100%"
              height="100%"
            />
          </div>
        </div>

        {/* Bottom row - Line Graph */}
        <div style={{
          height: `${(168/776*100).toFixed(3)}vh`,
          marginBottom: `${(8/776*100).toFixed(3)}vh`
        }}>
          <LineGraph 
            data={graphData}
            currentTime={currentTime}
            totalDuration={totalDuration}
            title="Sensor Data"
            onTimeChange={handleTimeChange}
          />
        </div>
      </div>

      {/* Video Player - at the bottom */}
      <div style={{
        position: 'absolute',
        bottom: `${(8/776*100).toFixed(3)}vh`,
        left: `calc(${(272/1536*100).toFixed(3)}vw + ${(280/1536*100).toFixed(3)}vw + ${(12/1536*100).toFixed(3)}vw)`, // Same left margin as video monitoring section
        right: `${(12/1536*100).toFixed(3)}vw`, // Same right margin
        zIndex: 4
      }}>
        <VideoPlayer 
          currentTime={currentTime}
          totalDuration={totalDuration}
          observations={observations}
          onTimeChange={handleTimeChange}
          onObservationClick={handleObservationClick}
        />
      </div>

      {/* Observation Modal */}
      <ObservationModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        onSubmit={handleObservationSubmit}
      />
    </div>
  );
}

/**
 * @returns - The current home page, which is the job data page for now 
 * @remark - In the final version, the home page should be the all jobs page
 */
export default function Home() {
  return (
    <JobNavigationProvider>
      <VideoProvider>
        <HomeContent />
      </VideoProvider>
    </JobNavigationProvider>
  );
}
