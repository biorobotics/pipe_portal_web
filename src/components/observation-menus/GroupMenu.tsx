/**
 * @fileoverview GroupMenu component for selecting a PACP group based on the selected family.
 * Fetches group options from a JSON file or uses fallback data if unavailable.
 * Uses BaseMenu for UI rendering.
 */

'use client';

import React, { useState, useEffect } from 'react';
import BaseMenu from './BaseMenu';

/**
 * Props for GroupMenu component.
 * @property family - The selected PACP family name.
 * @property onSelect - Callback when a group is selected.
 */
interface GroupMenuProps {
  family: string;
  onSelect: (group: string) => void;
}

/**
 * Type for 2 layer PACP data structure loaded from JSON.
 */
interface PACPData {
  name: string;
  children: Array<{
    name: string;
    children?: any[];
  }>;
}

/**
 * GroupMenu component for selecting a PACP group based on the selected family.
 * @param param0 - The props for the GroupMenu component.
 * @returns GroupMenu component.
 */
export default function GroupMenu({ family, onSelect }: GroupMenuProps) {
  // List of group options to display.
  // This state will hold the groups available for the selected family.
  const [groups, setGroups] = useState<Array<{ name: string }>>([]);

  // Effect to fetch PACP codes and filter by family
  // If fetch fails, it uses fallback data.
  useEffect(() => {
    // Load PACP codes json and filter by family
    fetch('/pacp_codes.json')
      .then(response => response.json())
      .then((data: PACPData) => {
        const selectedFamily = data.children.find(f => f.name === family);
        if (selectedFamily && selectedFamily.children) {
          const groupOptions = selectedFamily.children.map(group => ({
            name: group.name
          }));
          setGroups(groupOptions);
        } else {
          setGroups([]);
        }
      })
      .catch(error => {
        console.error('Error loading PACP codes:', error);
        // Fallback data based on family
        const fallbackGroups = {
          'Structural': [
            { name: 'Crack (C)' },
            { name: 'Fracture (F)' },
            { name: 'Pipe Failures (Silent)' },
            { name: 'Collapse (X)' },
            { name: 'Deformed (D)' },
            { name: 'Joint (J)' },
            { name: 'Surface Damage Chemical (S)' },
            { name: 'Surface Damage Mechanical (M)' },
            { name: 'Surface Damage Not Evident (Z)' }
          ],
          'Operational & Maintenance': [
            { name: 'Deposits Attached (DA)' },
            { name: 'Deposits Settled (DS)' },
            { name: 'Deposits Ingress (DN)' },
            { name: 'Roots (R)' },
            { name: 'Infiltration (I)' },
            { name: 'Obstacles/Obstructions (OB)' },
            { name: 'Vermin (V)' }
          ],
          'Construction Features': [
            { name: 'Tap (T)' },
            { name: 'Intruding Seal Material (IS)' },
            { name: 'Line (L)' },
            { name: 'Access Point (A)' }
          ],
          'Other': [
            { name: 'Miscellaneous (M)' }
          ]
        };
        setGroups(fallbackGroups[family as keyof typeof fallbackGroups] || []);
      });
  }, [family]);

  return (
    <BaseMenu
      title="Select Group"
      options={groups}
      onSelect={onSelect}
      searchPlaceholder="Search groups..."
    />
  );
} 