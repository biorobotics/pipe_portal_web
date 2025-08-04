'use client';

import { useState } from 'react';
import WorkOrderItem from './WorkOrderItem';
import JobItem from './JobItem';

interface WorkOrder {
  id: string;
  name: string;
  jobs: Job[];
}

interface Job {
  id: string;
  name: string;
}

interface WorkOrderExplorerProps {
  onWorkOrderSelect?: (workOrderId: string) => void;
  onJobSelect?: (jobId: string) => void;
}

export default function WorkOrderExplorer({ 
  onWorkOrderSelect, 
  onJobSelect 
}: WorkOrderExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | null>('job1');
  const [expandedWorkOrders, setExpandedWorkOrders] = useState<Set<string>>(new Set(['wo1']));

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

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    
    // Find the work order that contains this job and expand it
    const workOrder = workOrders.find(wo => wo.jobs.some(job => job.id === jobId));
    if (workOrder) {
      setExpandedWorkOrders(new Set([...expandedWorkOrders, workOrder.id]));
    }
    
    if (onJobSelect) {
      onJobSelect(jobId);
    }
  };

  const handleWorkOrderToggle = (workOrderId: string, expanded: boolean) => {
    const newExpanded = new Set(expandedWorkOrders);
    if (expanded) {
      newExpanded.add(workOrderId);
    } else {
      newExpanded.delete(workOrderId);
    }
    setExpandedWorkOrders(newExpanded);
  };

  return (
    <div style={{
      width: '264px',
      background: '#484848',
      borderLeft: '2px solid #7c7c7c',
      height: '70vh', // Extend to bottom of page
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search Bar */}
      <div style={{
        padding: '12px'
      }}>
        <input
          type="text"
          placeholder="Search work orders and jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#333333',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontFamily: 'Roboto, Arial, sans-serif',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Work Orders List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0'
      }}>
        {filteredWorkOrders.map((workOrder) => (
          <WorkOrderItem
            key={workOrder.id}
            name={workOrder.name}
            isExpanded={expandedWorkOrders.has(workOrder.id)}
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