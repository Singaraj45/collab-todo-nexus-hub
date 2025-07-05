
import { Calendar, User } from 'lucide-react';
import { Task } from '@/types/Task';
import { formatDate, isOverdue } from '@/utils/taskHelpers';

interface TaskCardMetadataProps {
  task: Task;
}

const TaskCardMetadata = ({ task }: TaskCardMetadataProps) => {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground transition-all duration-300 group-hover:text-gray-300">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
          <Calendar className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          <span className={`transition-colors duration-300 ${isOverdue(task) ? 'text-red-400 font-medium animate-pulse' : ''}`}>
            {formatDate(task.dueDate)}
          </span>
        </div>
        
        {task.sharedWith.length > 0 && (
          <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
            <User className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span>{task.sharedWith.length} shared</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 transition-all duration-300 group-hover:text-gray-300">
        Updated {new Date(task.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCardMetadata;
