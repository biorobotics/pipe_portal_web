'use client';

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
import { JobNavigationProvider } from "../contexts/JobNavigationContext";
import { VideoProvider, useVideo } from "../contexts/VideoContext";

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

  // Convert observations to the format expected by ObservationsGallery
  const sampleObservations = observations.map(obs => ({
    id: obs.id,
    title: obs.title,
    subtitle: obs.subtitle,
    timestamp: obs.timestamp,
    thumbnailUrl: obs.thumbnailUrl
  }));

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handleObservationClick = (observationId: string) => {
    const observation = observations.find(obs => obs.id === observationId);
    if (observation) {
      setCurrentTime(observation.time);
      setHighlightedObservation(observationId);
    }
  };

  return (
    <div style={{
      marginLeft: "96px", // Account for the left sidebar
      minHeight: "calc(100vh - 64px)",
      background: "#EAEAEA",
      position: "relative",
      zIndex: 0
    }}>
      {/* Navigation area with proper spacing */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        zIndex: 1
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
      
      {/* Data Section - positioned in main content area */}
      <div style={{
        position: 'absolute',
        top: '48px', // Position below job nav bar (40px + 8px gap)
        left: '272px', // Position to the right of work order explorer, same margin as job nav bar
        zIndex: 4
      }}>
        <DataSection 
          latitude={currentData.latitude}
          longitude={currentData.longitude}
          altitude={currentData.altitude}
          pipeDiameter={currentData.pipeDiameter}
        />
      </div>

      {/* Video Monitoring Section - positioned to the right of data section */}
      <div style={{
        position: 'absolute',
        top: '48px',
        left: 'calc(272px + 280px + 12px)', // Right of data section with 12px margin
        right: '12px', // 12px margin from right edge
        bottom: '140px', // Space for video player
        zIndex: 4
      }}>
        {/* Top row - Cam 1 and Cam 2 */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '8px',
          height: '168px'
        }}>
          <div style={{ flex: 1 }}>
            <VideoPanel 
              cameraName="Cam 1"
              timestamp={formatTime(currentTime)}
              isCircular={false}
              width="100%"
              height="100%"
            />
          </div>
          <div style={{ flex: 1 }}>
            <VideoPanel 
              cameraName="Cam 2"
              timestamp={formatTime(currentTime)}
              isCircular={false}
              width="100%"
              height="100%"
            />
          </div>
        </div>

        {/* Middle row - Line Graph */}
        <div style={{
          height: '168px',
          marginBottom: '8px'
        }}>
          <LineGraph 
            data={graphData}
            currentTime={currentTime}
            totalDuration={totalDuration}
            title="Sensor Data"
          />
        </div>

        {/* Bottom row - 360 Camera */}
        <div style={{
          height: '160px'
        }}>
          <VideoPanel 
            cameraName="360 Camera"
            timestamp={formatTime(currentTime)}
            isCircular={false}
            width="100%"
            height="100%"
          />
        </div>
      </div>

      {/* Video Player - at the bottom */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: 'calc(272px + 280px + 12px)', // Same left margin as video monitoring section
        right: '12px', // Same right margin
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

      {/* Observations Gallery - positioned below Data Section */}
      <div style={{
        position: 'absolute',
        top: 'calc(48px + calc(35vh - 40px) + 8px)', // Position below Data Section with new height
        left: '272px', // Same left margin as Data Section
        zIndex: 4
      }}>
        <ObservationsGallery 
          observations={sampleObservations} 
          highlightedObservation={highlightedObservation}
          onObservationClick={handleObservationClick}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <JobNavigationProvider>
      <VideoProvider>
        <HomeContent />
      </VideoProvider>
    </JobNavigationProvider>
  );
}
