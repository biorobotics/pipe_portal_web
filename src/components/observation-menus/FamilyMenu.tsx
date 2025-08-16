/**
 * @fileoverview FamilyMenu component for selecting a PACP family
 * Fetches family options from a JSON file or uses fallback data if unavailable.
 * Uses BaseMenu for UI rendering.
 */

'use client';

import React, { useState, useEffect } from 'react';
import BaseMenu from './BaseMenu';

/**
 * Props for FamilyMenu component.
 * @property onSelect - Callback when a family is selected.
 */
interface FamilyMenuProps {
  onSelect: (family: string) => void;
}

/**
 * Type for PACP data structure loaded from JSON.
 * This structure is expected to have a name and children.
 * The children can be nested, but for families, we only need the first level.
 * This is a simplified version of the PACP data structure.
 * @property name - The name of the family.
 * @property children - The children of the family, which can be groups or descriptors.
 */
interface PACPData {
  name: string;
  children: Array<{
    name: string;
    children?: any[];
  }>;
}

/**
 * FamilyMenu component for selecting a PACP family.
 * @param param0 - The props for the FamilyMenu component.
 * @returns FamilyMenu component.
 */
export default function FamilyMenu({ onSelect }: FamilyMenuProps) {
  // Family options to display
  const [families, setFamilies] = useState<Array<{ name: string }>>([]);

  // Effect to fetch PACP codes and set family options
  // If fetch fails, it uses fallback data.
  useEffect(() => {
    // Load PACP codes json
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