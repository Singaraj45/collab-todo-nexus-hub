
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import TaskFilters from '@/components/TaskFilters';
import AuthComponent from '@/components/AuthComponent';
import { Plus, Bell, User } from 'lucide-react';

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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    dueToday: false,
    overdue: false
  });

  // Mock initial tasks
  useEffect(() => {
    if (isAuthenticated) {
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete project proposal',
          description: 'Draft and finalize the Q4 project proposal for client presentation',
          priority: 'high',
          status: 'in-progress',
          dueDate: new Date().toISOString().split('T')[0],
          sharedWith: ['john@example.com'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Review team feedback',
          description: 'Go through all team member feedback on the new feature',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          sharedWith: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Setup development environment',
          description: 'Configure Docker containers and database for new project',
          priority: 'low',
          status: 'completed',
          dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          sharedWith: ['alice@example.com', 'bob@example.com'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
    }
  }, [isAuthenticated]);

  // Filter tasks based on current filters
  useEffect(() => {
    let filtered = [...tasks];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.dueToday) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.dueDate === today);
    }
    
    if (filters.overdue) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.dueDate < today && task.status !== 'completed');
    }
    
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      // Simulate receiving real-time updates
      console.log('Checking for real-time updates...');
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    toast({
      title: "Welcome!",
      description: "Successfully logged in to your dashboard.",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
    setFilteredTasks([]);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTasks(prev => [newTask, ...prev]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
    setIsTaskFormOpen(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Task has been removed from your list.",
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate < today && t.status !== 'completed';
    }).length;
    
    return { total, completed, inProgress, overdue };
  };

  if (!isAuthenticated) {
    return <AuthComponent onLogin={handleLogin} />;
  }

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {stats.total} tasks
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {stats.overdue > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.overdue}
                  </span>
                )}
              </Button>
              
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Tasks</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">In Progress</p>
                  <p className="text-3xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Overdue</p>
                  <p className="text-3xl font-bold">{stats.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TaskFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Tasks ({filteredTasks.length})
              </h2>
              <Button onClick={() => {
                setEditingTask(null);
                setIsTaskFormOpen(true);
              }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <Card className="p-8 text-center animate-fade-in">
                  <CardContent>
                    <p className="text-gray-500 mb-4">No tasks found</p>
                    <Button onClick={() => {
                      setEditingTask(null);
                      setIsTaskFormOpen(true);
                    }}>
                      Create your first task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col space-y-4">
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={(task) => {
                          setEditingTask(task);
                          setIsTaskFormOpen(true);
                        }}
                        onDelete={handleDeleteTask}
                        onStatusChange={(taskId, status) => handleUpdateTask(taskId, { status })}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? 
            (data) => handleUpdateTask(editingTask.id, data) : 
            handleCreateTask
          }
          onCancel={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
