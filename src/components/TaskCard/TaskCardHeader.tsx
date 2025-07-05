
import { Badge } from "@/components/ui/badge";
import { Task } from '@/types/Task';
import { getPriorityColor, getStatusColor, isOverdue } from '@/utils/taskHelpers';

interface TaskCardHeaderProps {
  task: Task;
}

const TaskCardHeader = ({ task }: TaskCardHeaderProps) => {
  return (
    <div className="flex-1 min-w-0">
      {/* Priority and Status Badges */}
      <div className="flex items-center space-x-3 mb-3 transition-all duration-300">
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg
          ${getPriorityColor(task.priority)} group-hover:animate-pulse
        `} />
        <Badge 
          variant="outline" 
          className={`
            ${getStatusColor(task.status)} text-xs font-medium
            transition-all duration-300 hover:scale-105
            group-hover:shadow-md
          `}
        >
          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </Badge>
        {isOverdue(task) && (
          <Badge 
            variant="destructive" 
            className="text-xs animate-pulse transition-all duration-300 hover:scale-105"
          >
            Overdue
          </Badge>
        )}
      </div>

      {/* Task Title */}
      <h3 className={`
        text-lg font-semibold mb-2 transition-all duration-300
        group-hover:text-red-400 group-hover:transform group-hover:translate-x-1
        ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-foreground'}
      `}>
        {task.title}
      </h3>

      {/* Task Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 transition-all duration-300 group-hover:text-gray-300">
        {task.description}
      </p>
    </div>
  );
};

export default TaskCardHeader;
