
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TaskCardProps } from '@/types/Task';
import { isOverdue } from '@/utils/taskHelpers';
import TaskCardHeader from './TaskCard/TaskCardHeader';
import TaskCardActions from './TaskCard/TaskCardActions';
import TaskCardMetadata from './TaskCard/TaskCardMetadata';
import TaskCardSharedUsers from './TaskCard/TaskCardSharedUsers';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`
        group relative overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:scale-[1.02]
        animate-fade-in
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isOverdue(task) ? 'border-red-500/50 bg-gradient-to-r from-red-50/50 to-transparent' : 'hover:border-red-500/30'}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-600/5 before:to-purple-600/5
        before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col space-y-4">
          {/* Header Section with Flexbox Animation */}
          <div className="flex items-start justify-between transition-all duration-300 group-hover:transform group-hover:scale-[1.01]">
            <TaskCardHeader task={task} />
            <TaskCardActions 
              task={task}
              isHovered={isHovered}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          </div>

          {/* Metadata Section with Flexbox Layout */}
          <TaskCardMetadata task={task} />

          {/* Shared Users Section */}
          <TaskCardSharedUsers task={task} isHovered={isHovered} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
