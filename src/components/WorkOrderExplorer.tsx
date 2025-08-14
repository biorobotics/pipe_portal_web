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

  const handleJobSelect = (jobId: string) => {
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

  const handleWorkOrderToggle = (workOrderId: string, expanded: boolean) => {
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