
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from 'lucide-react';

interface FilterState {
  status: string;
  priority: string;
  search: string;
  dueToday: boolean;
  overdue: boolean;
}

interface TaskFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      search: '',
      dueToday: false,
      overdue: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.search) count++;
    if (filters.dueToday) count++;
    if (filters.overdue) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="sticky top-4 bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5 text-red-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-red-600 text-white">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden hover:bg-muted"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Search Tasks</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Priority</Label>
          <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>High Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Medium Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="low">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Low Priority</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3 pt-2 border-t border-border">
          <Label className="text-sm font-medium text-foreground">Quick Filters</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="due-today" className="text-sm text-foreground">Due Today</Label>
            <Switch
              id="due-today"
              checked={filters.dueToday}
              onCheckedChange={(checked) => updateFilter('dueToday', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="overdue" className="text-sm text-foreground">Overdue</Label>
            <Switch
              id="overdue"
              checked={filters.overdue}
              onCheckedChange={(checked) => updateFilter('overdue', checked)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
              className="w-full border-border hover:bg-muted"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Filter Summary */}
        <div className="text-xs text-muted-foreground pt-2">
          <p>Showing filtered results</p>
          {filters.search && <p>• Search: "{filters.search}"</p>}
          {filters.status !== 'all' && <p>• Status: {filters.status}</p>}
          {filters.priority !== 'all' && <p>• Priority: {filters.priority}</p>}
          {filters.dueToday && <p>• Due today</p>}
          {filters.overdue && <p>• Overdue tasks</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
