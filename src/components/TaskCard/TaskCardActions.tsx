
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Check } from 'lucide-react';
import { Task } from '@/types/Task';
import { nextStatus } from '@/utils/taskHelpers';

interface TaskCardActionsProps {
  task: Task;
  isHovered: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskCardActions = ({ task, isHovered, onEdit, onDelete, onStatusChange }: TaskCardActionsProps) => {
  return (
    <div className={`
      ml-4 flex items-center space-x-2 
      transition-all duration-300 transform
      ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 md:opacity-100 md:translate-x-0'}
    `}>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onStatusChange(task.id, nextStatus(task.status))}
        className="h-8 w-8 p-0 transition-all duration-300 hover:bg-green-500/20 hover:scale-110 hover:rotate-12"
      >
        <Check className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 transition-all duration-300 hover:bg-red-500/20 hover:scale-110 hover:-rotate-12"
          >
            <Edit className="h-4 w-4 transition-transform duration-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 animate-scale-in">
          <DropdownMenuItem onClick={() => onEdit(task)} className="transition-colors duration-200 hover:bg-red-500/10">
            <Edit className="h-4 w-4 mr-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStatusChange(task.id, 'todo')}
            disabled={task.status === 'todo'}
            className="transition-colors duration-200 hover:bg-red-500/10"
          >
            Mark as Todo
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStatusChange(task.id, 'in-progress')}
            disabled={task.status === 'in-progress'}
            className="transition-colors duration-200 hover:bg-red-500/10"
          >
            Mark as In Progress
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStatusChange(task.id, 'completed')}
            disabled={task.status === 'completed'}
            className="transition-colors duration-200 hover:bg-red-500/10"
          >
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(task.id)}
            className="text-red-600 focus:text-red-600 transition-colors duration-200 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskCardActions;
