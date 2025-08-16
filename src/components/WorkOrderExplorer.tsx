/**
 * @fileoverview WorkOrderExplorer component for browsing and searching work orders and jobs.
 * Displays a searchable, expandable list of work orders and their jobs, allowing selection and expansion
 * similar to the Windows File Explorer left sidebar.
 * Used to navigate and select jobs in the portal UI.
 * Uses client-side rendering.
 */
'use client';

import { useState } from 'react';
import WorkOrderItem from './WorkOrderItem';
import JobItem from './JobItem';

/**
 * Work order data structure.
 * @property id - Unique identifier for the work order.
 * @property name - Name of the work order.
 * @property jobs - Array of jobs under this work order.
 */
interface WorkOrder {
  id: string;
  name: string;
  jobs: Job[];
}


/**
 * Job data structure.
 * @property id - Unique identifier for the job.
 * @property name - Name of the job.
 */
interface Job {
  id: string;
  name: string;
}


/**
 * Props for the WorkOrderExplorer component.
 * @property onWorkOrderSelect - Optional callback when a work order is selected.
 * @property onJobSelect - Optional callback when a job is selected.
 */
interface WorkOrderExplorerProps {
  onWorkOrderSelect?: (workOrderId: string) => void;
  onJobSelect?: (jobId: string) => void;
}

/**
 * WorkOrderExplorer component for browsing and searching work orders and jobs.
 * Displays a searchable, expandable list of work orders and their jobs, allowing selection and expansion.
 * @param param - The props for the WorkOrderExplorer component.
 * @returns The work order explorer UI.
 */
export default function WorkOrderExplorer({ 
  onWorkOrderSelect, 
  onJobSelect 
}: WorkOrderExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | null>('job1');
  const [expandedWorkOrders, setExpandedWorkOrders] = useState<string[]>(['wo1']);

  // Sample data
  const workOrders: WorkOrder[] = [
    {
      id: 'wo1',
      name: 'Work Order 001',
      jobs: [
        { id: 'job1', name: 'Job Alpha' },
        { id: 'job2', name: 'Job Beta' },
        { id: 'job3', name: 'Job Gamma' }
      ]
    },
    {
      id: 'wo2',
      name: 'Work Order 002',
      jobs: [
        { id: 'job4', name: 'Job Delta' },
        { id: 'job5', name: 'Job Epsilon' }
      ]
    },
    {
      id: 'wo3',
      name: 'Work Order 003',
      jobs: [
        { id: 'job6', name: 'Job Zeta' }
      ]
    }
  ];

  // Filter work orders and jobs based on search term
  const filteredWorkOrders = workOrders.map(wo => ({
    ...wo,
    jobs: wo.jobs.filter(job => 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(wo => 
    wo.jobs.length > 0 || 
    wo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  /**
   * Handles job selection, updates state, expands the relevant work order, and triggers callback.
   * @param jobId - The ID of the selected job.
   */
  const handleJobSelect = (jobId: string): void => {
    setSelectedJob(jobId);
    // Find the work order that contains this job and expand it
    const workOrder = workOrders.find(wo => wo.jobs.some(job => job.id === jobId));
    if (workOrder) {
      setExpandedWorkOrders(prev => prev.includes(workOrder.id) ? prev : [...prev, workOrder.id]);
    }
    if (onJobSelect) {
      onJobSelect(jobId);
    }
  };


  /**
   * Handles toggling the expansion state of a work order.
   * @param workOrderId - The ID of the work order to toggle.
   * @param expanded - Whether the work order should be expanded.
   */
  const handleWorkOrderToggle = (workOrderId: string, expanded: boolean): void => {
    setExpandedWorkOrders(prev => {
      if (expanded) {
        return prev.includes(workOrderId) ? prev : [...prev, workOrderId];
      } else {
        return prev.filter(id => id !== workOrderId);
      }
    });
  };

  return (
    <div style={{
      width: `${(264/1536*100).toFixed(3)}vw`,
      background: '#484848',
      borderLeft: `${(2/1536*100).toFixed(3)}vw solid #7c7c7c`,
      height: '70vh', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Bar */}
      <div style={{
        padding: `${(12/776*100).toFixed(3)}vh ${(12/1536*100).toFixed(3)}vw`
      }}>
        <input
          type="text"
          placeholder="Search work orders and jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: `${(8/776*100).toFixed(3)}vh ${(12/1536*100).toFixed(3)}vw`,
            background: '#333333',
            border: `${(1/1536*100).toFixed(3)}vw solid #555`,
            borderRadius: `${(4/1536*100).toFixed(3)}vw`,
            color: '#FFFFFF',
            fontSize: `${(14/1536*100).toFixed(3)}vw`,
            fontFamily: 'Roboto, Arial, sans-serif',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Work Orders List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: `${(8/776*100).toFixed(3)}vh 0`
      }}>
        {filteredWorkOrders.map((workOrder) => (
          <WorkOrderItem
            key={workOrder.id}
            name={workOrder.name}
            isExpanded={expandedWorkOrders.includes(workOrder.id)}
            onToggle={(expanded) => handleWorkOrderToggle(workOrder.id, expanded)}
          >
            {workOrder.jobs.map((job) => (
              <JobItem
                key={job.id}
                name={job.name}
                isSelected={selectedJob === job.id}
                onSelect={() => handleJobSelect(job.id)}
              />
            ))}
          </WorkOrderItem>
        ))}
      </div>
    </div>
  );
} 