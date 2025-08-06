'use client';

import React, { useState, useEffect } from 'react';
import BaseMenu from './BaseMenu';

interface FamilyMenuProps {
  onSelect: (family: string) => void;
}

interface PACPData {
  name: string;
  children: Array<{
    name: string;
    children?: any[];
  }>;
}

export default function FamilyMenu({ onSelect }: FamilyMenuProps) {
  const [families, setFamilies] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    // Load PACP data
    fetch('/pacp_codes.json')
      .then(response => response.json())
      .then((data: PACPData) => {
        const familyOptions = data.children.map(family => ({
          name: family.name
        }));
        setFamilies(familyOptions);
      })
      .catch(error => {
        console.error('Error loading PACP codes:', error);
        // Fallback data
        setFamilies([
          { name: 'Structural' },
          { name: 'Operational & Maintenance' },
          { name: 'Construction Features' },
          { name: 'Other' }
        ]);
      });
  }, []);

  return (
    <BaseMenu
      title="Select Family"
      options={families}
      onSelect={onSelect}
      searchPlaceholder="Search families..."
    />
  );
} 