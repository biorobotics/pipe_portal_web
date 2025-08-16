/**
 * @fileoverview ObservationModal component for creating and submitting a new observation.
 * Provides a multi-stage modal with draggable UI and breadcrumbs for navigation.
 * Uses client-side rendering.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import FamilyMenu from './observation-menus/FamilyMenu';
import GroupMenu from './observation-menus/GroupMenu';
import DescriptorMenu from './observation-menus/DescriptorMenu';
import DetailsMenu from './observation-menus/DetailsMenu';


/**
 * Data structure for an observation.
 * @property family - The selected family.
 * @property group - The selected group.
 * @property descriptor - The selected descriptor.
 * @property code - The PACP code for the descriptor.
 * @property remark - User remark for the observation.
 * @property clockPosition - Clock position for the observation.
 */
interface ObservationData {
  family: string;
  group: string;
  descriptor: string;
  code: string;
  remark: string;
  clockPosition: number;
}


/**
 * Props for the ObservationModal component.
 * @property isOpen - Whether the modal is open.
 * @property onClose - Callback to close the modal.
 * @property onSubmit - Callback to submit the observation data.
 */
interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (observation: ObservationData) => void;
}


/**
 * Stages of the modal menu.
 */
type MenuStage = 'family' | 'group' | 'descriptor' | 'details';


/**
 * ObservationModal component for creating and submitting a new observation.
 * Provides a multi-stage modal with draggable UI and breadcrumbs for navigation.
 * Users first select a family, then a group, then a descriptor, and lastly enter remarks and the 
 * observation's clock position.
 *
 * @param param0 - The props for the ObservationModal component.
 * @returns The ObservationModal component.
 */
export default function ObservationModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: ObservationModalProps) {
  /**
   * Current stage of the modal menu.
   */
  const [currentStage, setCurrentStage] = useState<MenuStage>('family');
  /**
   * Observation data being constructed.
   */
  const [observationData, setObservationData] = useState<ObservationData>({
    family: '',
    group: '',
    descriptor: '',
    code: '',
    remark: '',
    clockPosition: 12
  });
  /**
   * Whether the modal is currently being dragged.
   */
  const [isDragging, setIsDragging] = useState(false);
  /**
   * Offset of the mouse from the modal's top-left during drag.
   */
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  /**
   * Current position of the modal on the screen.
   */
  const [modalPosition, setModalPosition] = useState({ x: 116, y: 50 }); // Initial position
  /**
   * Ref to the modal div for drag calculations.
   */
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStage('family');
      setObservationData({
        family: '',
        group: '',
        descriptor: '',
        code: '',
        remark: '',
        clockPosition: 12
      });
      // Reset position when opened
      setModalPosition({ x: 116, y: 50 });
    }
  }, [isOpen]);

  // Handle various mouse events for dragging the modal
  const handleMouseDown = (event: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;
      
      // Keep modal within viewport bounds
      const maxX = window.innerWidth - 400; // Modal width
      const maxY = window.innerHeight - 400; // Approximate modal height
      
      setModalPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle family selection
  const handleFamilySelect = (family: string) => {
    setObservationData(prev => ({ ...prev, family }));
    setCurrentStage('group');
  };

  // Handle group selection
  const handleGroupSelect = (group: string) => {
    setObservationData(prev => ({ ...prev, group }));
    setCurrentStage('descriptor');
  };

  // Handle descriptor selection
  const handleDescriptorSelect = (descriptor: string, code: string) => {
    setObservationData(prev => ({ ...prev, descriptor, code }));
    setCurrentStage('details');
  };

  // Handle details submission
  const handleDetailsSubmit = (remark: string, clockPosition: number) => {
    const finalData = {
      ...observationData,
      remark,
      clockPosition
    };
    onSubmit(finalData);
    onClose();
  };

  // Handle back navigation in the modal
  const handleBack = () => {
    switch (currentStage) {
      case 'group':
        setCurrentStage('family');
        setObservationData(prev => ({ ...prev, group: '', descriptor: '', code: '' }));
        break;
      case 'descriptor':
        setCurrentStage('group');
        setObservationData(prev => ({ ...prev, descriptor: '', code: '' }));
        break;
      case 'details':
        setCurrentStage('descriptor');
        setObservationData(prev => ({ ...prev, remark: '', clockPosition: 12 }));
        break;
    }
  };

  // Handle breadcrumb clicks to navigate back to previous stages
  const handleBreadcrumbClick = (stage: MenuStage) => {
    switch (stage) {
      case 'family':
        setCurrentStage('family');
        setObservationData(prev => ({ 
          ...prev, 
          family: '', 
          group: '', 
          descriptor: '', 
          code: '' 
        }));
        break;
      case 'group':
        setCurrentStage('group');
        setObservationData(prev => ({ 
          ...prev, 
          descriptor: '', 
          code: '' 
        }));
        break;
      case 'descriptor':
        setCurrentStage('descriptor');
        setObservationData(prev => ({ 
          ...prev, 
          remark: '', 
          clockPosition: 12 
        }));
        break;
    }
  };

  // Generate breadcrumb string based on current observation data
  const getBreadcrumb = () => {
    const parts = [];
    if (observationData.family) parts.push(observationData.family);
    if (observationData.group) parts.push(observationData.group);
    if (observationData.descriptor) parts.push(observationData.descriptor);
    return parts.join(' > ');
  };

  if (!isOpen) return null;
  
  // Modal styles and structure
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      pointerEvents: 'none' // Allow clicks to pass through to background
    }}>
      <div 
        ref={modalRef}
        style={{
          position: 'absolute',
          left: modalPosition.x,
          top: modalPosition.y,
          background: '#242424',
          border: '0.13vh solid #444',
          borderRadius: '0',
          width: '26.04vw',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto', // Re-enable pointer events for modal content
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none'
        }}
      >
        {/* Draggable Header */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2.06vh',
            borderBottom: '0.13vh solid #444',
            cursor: 'grab',
            background: isDragging ? '#333' : 'transparent',
            transition: 'background-color 0.2s'
          }}
          onMouseDown={handleMouseDown}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.55vh'
          }}>
            {currentStage !== 'family' && (
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '0.52vh',
                  borderRadius: '0.52vh',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
              </button>
            )}
            <h2 style={{
              margin: 0,
              fontSize: '1.17vw',
              fontWeight: 'bold',
              color: '#ffffff',
              fontFamily: 'Roboto, sans-serif'
            }}>
              {currentStage === 'family' && 'Select Family'}
              {currentStage === 'group' && 'Select Group'}
              {currentStage === 'descriptor' && 'Select Descriptor'}
              {currentStage === 'details' && 'Enter Details'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.52vh',
              borderRadius: '0.52vh',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Breadcrumb */}
        {getBreadcrumb() && (
          <div style={{
            padding: `${(8/776*100).toFixed(3)}vh ${(16/1536*100).toFixed(3)}vw`,
            fontSize: `${(12/1536*100).toFixed(3)}vw`,
            color: '#ffff',
            fontFamily: 'Roboto Condensed, sans-serif'
          }}>
            {observationData.family && (
              <span
                style={{
                  cursor: 'pointer',
                  padding: `${(2/776*100).toFixed(3)}vh ${(4/1536*100).toFixed(3)}vw`,
                  borderRadius: `${(2/1536*100).toFixed(3)}vw`,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => handleBreadcrumbClick('family')}
              >
                {observationData.family}
              </span>
            )}
            {observationData.group && (
              <>
                <span style={{ margin: '0 0.26vh' }}> {'>'} </span>
                <span
                  style={{
                    cursor: 'pointer',
                    padding: '0.26vh 0.26vw',
                    borderRadius: '0.26vh',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => handleBreadcrumbClick('group')}
                >
                  {observationData.group}
                </span>
              </>
            )}
            {observationData.descriptor && (
              <>
                <span style={{ margin: '0 0.26vh' }}> {'>'} </span>
                <span
                  style={{
                    cursor: 'pointer',
                    padding: '0.26vh 0.26vw',
                    borderRadius: '0.26vh',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => handleBreadcrumbClick('descriptor')}
                >
                  {observationData.descriptor}
                </span>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {currentStage === 'family' && (
            <FamilyMenu onSelect={handleFamilySelect} />
          )}
          {currentStage === 'group' && (
            <GroupMenu 
              family={observationData.family}
              onSelect={handleGroupSelect}
            />
          )}
          {currentStage === 'descriptor' && (
            <DescriptorMenu 
              family={observationData.family}
              group={observationData.group}
              onSelect={handleDescriptorSelect}
            />
          )}
          {currentStage === 'details' && (
            <DetailsMenu 
              family={observationData.family}
              group={observationData.group}
              descriptor={observationData.descriptor}
              onSubmit={handleDetailsSubmit}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
} 