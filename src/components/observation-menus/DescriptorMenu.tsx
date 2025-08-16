
/**
 * @fileoverview DescriptorMenu component for selecting a descriptor based on PACP family and group.
 * Fetches descriptor options from a JSON file or uses fallback data if unavailable.
 * Uses BaseMenu for UI rendering.
 */
'use client';


import React, { useState, useEffect } from 'react';
import BaseMenu from './BaseMenu';


/**
 * Props for DescriptorMenu component.
 * @property family - The selected PACP family name.
 * @property group - The selected PACP group name.
 * @property onSelect - Callback when a descriptor is selected.
 */
interface DescriptorMenuProps {
  family: string;
  group: string;
  onSelect: (descriptor: string, code: string) => void;
}


/**
 * Type for PACP data structure loaded from JSON.
 */
interface PACPData {
  name: string;
  children: Array<{
    name: string;
    children?: Array<{
      name: string;
      code?: string;
      children?: Array<{
        name: string;
        code: string;
      }>;
    }>;
  }>;
}


/**
 * DescriptorMenu component for selecting a descriptor option based on PACP family and group.
 * @param param0 - The props for the DescriptorMenu component.
 * @return DescriptorMenu component.
 */
export default function DescriptorMenu({ family, group, onSelect }: DescriptorMenuProps) {
  // List of descriptor options to display in the menu.
  const [descriptors, setDescriptors] = useState<Array<{ name: string; code?: string }>>([]);

  // Effect to fetch PACP codes and filter by family and group
  // If fetch fails, it uses fallback data.
  useEffect(() => {
    // Load PACP codes json and filter by family and group
    fetch('/pacp_codes.json')
      .then(response => response.json())
      .then((data: PACPData) => {
        /**
         * Find the selected family and group in the PACP data.
         */
        const selectedFamily = data.children.find(f => f.name === family);
        if (selectedFamily && selectedFamily.children) {
          const selectedGroup = selectedFamily.children.find(g => g.name === group);
          if (selectedGroup && selectedGroup.children) {
            const descriptorOptions = selectedGroup.children.map(descriptor => ({
              name: descriptor.name,
              code: descriptor.code
            }));
            setDescriptors(descriptorOptions);
          } else {
            setDescriptors([]);
          }
        } else {
          setDescriptors([]);
        }
      })
      .catch(error => {
        // Print error message to console
        console.error('Error loading PACP codes:', error);
        // Fallback data if JSON fetch fails
        const fallbackDescriptors = {
          'Structural': {
            'Crack (C)': [
              { name: 'Circumferential (C)', code: 'CC' },
              { name: 'Longitudinal (L)', code: 'CL' },
              { name: 'Multiple (M)', code: 'CM' },
              { name: 'Spiral (S)', code: 'CS' }
            ],
            'Fracture (F)': [
              { name: 'Circumferential (C)', code: 'FC' },
              { name: 'Longitudinal (L)', code: 'FL' },
              { name: 'Multiple (M)', code: 'FM' },
              { name: 'Spiral (S)', code: 'FS' }
            ]
          },
          'Operational & Maintenance': {
            'Deposits Attached (DA)': [
              { name: 'Encrustation (E)', code: 'DAE' },
              { name: 'Grease (G)', code: 'DAGS' },
              { name: 'Ragging (R)', code: 'DAR' },
              { name: 'Other (Z)', code: 'DAZ' }
            ]
          }
        };
        // Use fallback data based on family and group
        const familyData = fallbackDescriptors[family as keyof typeof fallbackDescriptors];
        const groupData = familyData?.[group as keyof typeof familyData];
        setDescriptors(groupData || []);
      });
  }, [family, group]);

  return (
    <BaseMenu
      title="Select Descriptor"
      options={descriptors}
      onSelect={(name, code) => onSelect(name, code || '')}
      searchPlaceholder="Search descriptors..."
    />
  );
}