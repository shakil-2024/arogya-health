import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Deadline {
  id: string;
  type: 'vaccination' | 'checkup' | 'test';
  title: string;
  dueDate: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
  location: string;
}

const dummyDeadlines: Deadline[] = [
  {
    id: '1',
    type: 'vaccination',
    title: 'COVID-19 Booster Shot',
    dueDate: '2024-09-27',
    daysLeft: 5,
    priority: 'high',
    location: 'City Medical Center'
  },
  {
    id: '2',
    type: 'checkup',
    title: 'Annual Health Checkup',
    dueDate: '2024-10-15',
    daysLeft: 23,
    priority: 'medium',
    location: 'Apollo Medical Center'
  },
  {
    id: '3',
    type: 'test',
    title: 'Blood Sugar Test',
    dueDate: '2024-10-05',
    daysLeft: 13,
    priority: 'medium',
    location: 'City General Hospital'
  },
  {
    id: '4',
    type: 'vaccination',
    title: 'Flu Shot',
    dueDate: '2024-11-01',
    daysLeft: 40,
    priority: 'low',
    location: 'Local Clinic'
  }
];

export const UpcomingDeadlines: React.FC = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return '💉';
      case 'checkup': return '🏥';
      case 'test': return '🔬';
      default: return '📅';
    }
  };

  const handleScheduleAppointment = (deadline: Deadline) => {
    alert(`Scheduling appointment for ${deadline.title} at ${deadline.location}`);
  };

  return (
    <Card className="p-6 shadow-material-lg border-0 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Upcoming Deadlines</h2>
      </div>
      
      <div className="space-y-4">
        {dummyDeadlines.map((deadline) => (
          <div 
            key={deadline.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/30"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">
                {getTypeIcon(deadline.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{deadline.title}</h3>
                  <Badge variant={getPriorityColor(deadline.priority) as any}>
                    {deadline.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {deadline.daysLeft} days left
                  </div>
                  <span>📍 {deadline.location}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <Button 
              size="sm"
              onClick={() => handleScheduleAppointment(deadline)}
              className="shrink-0"
            >
              Schedule
            </Button>
          </div>
        ))}
        
        {dummyDeadlines.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming deadlines</p>
          </div>
        )}
      </div>
    </Card>
  );
};