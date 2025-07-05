
import { Badge } from "@/components/ui/badge";
import { Task } from '@/types/Task';

interface TaskCardSharedUsersProps {
  task: Task;
  isHovered: boolean;
}

const TaskCardSharedUsers = ({ task, isHovered }: TaskCardSharedUsersProps) => {
  if (task.sharedWith.length === 0) return null;

  return (
    <div className="pt-4 border-t border-border/50 transition-all duration-300">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-gray-300">
          Shared with:
        </span>
        <div className="flex flex-wrap gap-1">
          {task.sharedWith.map((email, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs transition-all duration-300 hover:scale-105 hover:bg-red-500/20"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: isHovered ? 'fade-in 0.3s ease-out forwards' : undefined
              }}
            >
              {email}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCardSharedUsers;
