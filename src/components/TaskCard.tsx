
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
      className={`
        group relative overflow-hidden
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:scale-[1.02]
        animate-fade-in
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isOverdue() ? 'border-red-500/50 bg-gradient-to-r from-red-50/50 to-transparent' : 'hover:border-red-500/30'}
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
                {isOverdue() && (
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

            {/* Action Buttons with Enhanced Animation */}
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
          </div>

          {/* Metadata Section with Flexbox Layout */}
          <div className="flex items-center justify-between text-sm text-muted-foreground transition-all duration-300 group-hover:text-gray-300">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 transition-all duration-300 hover:scale-105">
                <Calendar className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className={`transition-colors duration-300 ${isOverdue() ? 'text-red-400 font-medium animate-pulse' : ''}`}>
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

          {/* Shared Users Section */}
          {task.sharedWith.length > 0 && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
