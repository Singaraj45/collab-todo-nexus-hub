
import { Task } from '@/types/Task';

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const formatDate = (dateString: string) => {
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

export const isOverdue = (task: Task) => {
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today && task.status !== 'completed';
};

export const nextStatus = (currentStatus: Task['status']): Task['status'] => {
  switch (currentStatus) {
    case 'todo': return 'in-progress';
    case 'in-progress': return 'completed';
    case 'completed': return 'todo';
    default: return 'todo';
  }
};
