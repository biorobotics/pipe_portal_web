'use client';

import React, { useState, useEffect } from 'react';
import BaseMenu from './BaseMenu';

interface DescriptorMenuProps {
  family: string;
  group: string;
  onSelect: (descriptor: string, code: string) => void;
}

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

export default function DescriptorMenu({ family, group, onSelect }: DescriptorMenuProps) {
  const [descriptors, setDescriptors] = useState<Array<{ name: string; code?: string }>>([]);

  useEffect(() => {
    // Load PACP data and filter by family and group
    fetch('/pacp_codes.json')
      .then(response => response.json())
      .then((data: PACPData) => {
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
        console.error('Error loading PACP codes:', error);
        // Fallback data based on family and group
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