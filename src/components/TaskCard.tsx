
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Edit, Trash2, User, Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 0) return `${diffDays} days left`;
    
    return date.toLocaleDateString();
  };

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today && task.status !== 'completed';
  };

  const nextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'todo': return 'in-progress';
      case 'in-progress': return 'completed';
      case 'completed': return 'todo';
      default: return 'todo';
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg ${
        task.status === 'completed' ? 'opacity-75' : ''
      } ${isOverdue() ? 'border-red-200 bg-red-50' : 'hover:shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Priority indicator */}
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
              <Badge 
                variant="outline" 
                className={`${getStatusColor(task.status)} text-xs font-medium`}
              >
                {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              {isOverdue() && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>

            {/* Task title and description */}
            <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {task.description}
            </p>

            {/* Task metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                
                {task.sharedWith.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{task.sharedWith.length} shared</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400">
                Updated {new Date(task.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`ml-4 flex items-center space-x-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 md:opacity-100'
          }`}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onStatusChange(task.id, nextStatus(task.status))}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, 'todo')}
                  disabled={task.status === 'todo'}
                >
                  Mark as Todo
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, 'in-progress')}
                  disabled={task.status === 'in-progress'}
                >
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onStatusChange(task.id, 'completed')}
                  disabled={task.status === 'completed'}
                >
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Shared users */}
        {task.sharedWith.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Shared with:</span>
              <div className="flex flex-wrap gap-1">
                {task.sharedWith.map((email, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
