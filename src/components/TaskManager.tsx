import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Filter,
  Search,
  Target,
  TrendingUp
} from 'lucide-react';

interface WeddingTask {
  id: string;
  title: string;
  description: string;
  category: 'venue' | 'catering' | 'photography' | 'flowers' | 'music' | 'attire' | 'invitations' | 'transportation' | 'other';
  priority: 'low' | 'medium' | 'high';
  timeline: '12months' | '6months' | '3months' | '1month' | '1week' | 'dayof';
  dueDate: string;
  completed: boolean;
  createdDate: string;
  notes: string;
}

const SAMPLE_TASKS: WeddingTask[] = [
  {
    id: '1',
    title: 'Book wedding venue',
    description: 'Research and book the perfect wedding venue',
    category: 'venue',
    priority: 'high',
    timeline: '12months',
    dueDate: '2024-04-01',
    completed: true,
    createdDate: '2024-01-15',
    notes: 'Rosewood Manor booked! Garden ceremony confirmed.'
  },
  {
    id: '2',
    title: 'Choose wedding photographer',
    description: 'Interview photographers and book for engagement and wedding',
    category: 'photography',
    priority: 'high',
    timeline: '12months',
    dueDate: '2024-04-15',
    completed: true,
    createdDate: '2024-01-16',
    notes: 'Sarah Photography booked - amazing portfolio!'
  },
  {
    id: '3',
    title: 'Send save the dates',
    description: 'Design and send save the date cards to all guests',
    category: 'invitations',
    priority: 'medium',
    timeline: '6months',
    dueDate: '2024-07-01',
    completed: false,
    createdDate: '2024-01-17',
    notes: 'Need final guest list first'
  },
  {
    id: '4',
    title: 'Book catering service',
    description: 'Choose catering company and finalize menu',
    category: 'catering',
    priority: 'high',
    timeline: '6months',
    dueDate: '2024-06-01',
    completed: false,
    createdDate: '2024-01-18',
    notes: 'Tasting scheduled for next week'
  },
  {
    id: '5',
    title: 'Choose wedding flowers',
    description: 'Select florist and decide on bouquet and decorations',
    category: 'flowers',
    priority: 'medium',
    timeline: '3months',
    dueDate: '2024-09-01',
    completed: false,
    createdDate: '2024-01-19',
    notes: 'Want roses and peonies for spring theme'
  },
  {
    id: '6',
    title: 'Final dress fitting',
    description: 'Schedule final alterations and fitting',
    category: 'attire',
    priority: 'high',
    timeline: '1month',
    dueDate: '2024-11-01',
    completed: false,
    createdDate: '2024-01-20',
    notes: 'Second fitting went well, minor adjustments needed'
  },
  {
    id: '7',
    title: 'Create wedding playlist',
    description: 'Finalize music list with DJ',
    category: 'music',
    priority: 'medium',
    timeline: '1month',
    dueDate: '2024-11-15',
    completed: false,
    createdDate: '2024-01-21',
    notes: 'Must-play and do-not-play lists ready'
  },
  {
    id: '8',
    title: 'Confirm transportation',
    description: 'Book wedding day transportation',
    category: 'transportation',
    priority: 'medium',
    timeline: '1week',
    dueDate: '2024-11-25',
    completed: false,
    createdDate: '2024-01-22',
    notes: 'Looking at vintage car rental'
  }
];

const TIMELINE_LABELS = {
  '12months': '12+ Months Before',
  '6months': '6-12 Months Before',
  '3months': '3-6 Months Before',
  '1month': '1-3 Months Before',
  '1week': '1-4 Weeks Before',
  'dayof': 'Day of Wedding'
};

const CATEGORY_LABELS = {
  venue: 'Venue',
  catering: 'Catering',
  photography: 'Photography',
  flowers: 'Flowers',
  music: 'Music',
  attire: 'Attire',
  invitations: 'Invitations',
  transportation: 'Transportation',
  other: 'Other'
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<WeddingTask[]>(SAMPLE_TASKS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WeddingTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTimeline, setFilterTimeline] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const [newTask, setNewTask] = useState<Omit<WeddingTask, 'id' | 'createdDate'>>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    timeline: '6months',
    dueDate: '',
    completed: false,
    notes: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesTimeline = filterTimeline === 'all' || task.timeline === filterTimeline;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesTimeline && matchesCompleted;
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: WeddingTask = {
      ...newTask,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      timeline: '6months',
      dueDate: '',
      completed: false,
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTask = (task: WeddingTask) => {
    setEditingTask(task);
    setNewTask(task);
    setIsAddDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title.trim()) return;

    setTasks(tasks.map(task => 
      task.id === editingTask.id 
        ? { ...newTask, id: editingTask.id, createdDate: editingTask.createdDate }
        : task
    ));
    
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      timeline: '6months',
      dueDate: '',
      completed: false,
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, highPriority, overdue, completionRate };
  };

  const stats = getStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      venue: 'text-purple-600 bg-purple-50',
      catering: 'text-orange-600 bg-orange-50',
      photography: 'text-blue-600 bg-blue-50',
      flowers: 'text-pink-600 bg-pink-50',
      music: 'text-indigo-600 bg-indigo-50',
      attire: 'text-rose-600 bg-rose-50',
      invitations: 'text-cyan-600 bg-cyan-50',
      transportation: 'text-gray-600 bg-gray-50',
      other: 'text-slate-600 bg-slate-50'
    };
    return colors[category] || colors.other;
  };

  const groupedTasks = Object.keys(TIMELINE_LABELS).map(timeline => ({
    timeline,
    label: TIMELINE_LABELS[timeline],
    tasks: filteredTasks.filter(task => task.timeline === timeline)
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          <CheckSquare className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl text-gray-800">Wedding Task Manager</h1>
          <Target className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay organized with your wedding planning timeline. Track tasks, set priorities, and never miss an important deadline.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl text-blue-600 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-green-600 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-red-600 mb-1">{stats.highPriority}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl text-orange-600 mb-1">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div className="text-2xl text-blue-600">{stats.completionRate}%</div>
          </div>
          <div className="text-sm text-gray-600">Progress</div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Wedding Planning Progress</span>
              <span className="text-sm text-gray-800">{stats.completed}/{stats.total} tasks completed</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filters:</span>
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={filterTimeline}
              onChange={(e) => setFilterTimeline(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Timelines</option>
              {Object.entries(TIMELINE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Show completed tasks
            </label>
          </div>
        </div>
      </Card>

      {/* Tasks by Timeline */}
      <div className="space-y-6">
        {groupedTasks.map(({ timeline, label, tasks: timelineTasks }) => (
          <Card key={timeline} className="overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="text-lg text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                {label}
                <Badge variant="secondary" className="ml-2">
                  {timelineTasks.length}
                </Badge>
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {timelineTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks for this timeline</p>
              ) : (
                timelineTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                      task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(task.id)}
                        className={`mt-1 h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                          task.completed ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                      >
                        {task.completed && (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className={`text-gray-800 ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getCategoryColor(task.category)}>
                            {CATEGORY_LABELS[task.category]}
                          </Badge>
                          
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority} priority
                          </Badge>
                          
                          {task.dueDate && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                              {new Date(task.dueDate) < new Date() && !task.completed && (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              )}
                            </Badge>
                          )}
                        </div>
                        
                        {task.notes && (
                          <p className="text-sm text-gray-500 italic">{task.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Task Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-gray-800 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="What needs to be done?"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Additional details about this task..."
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value as WeddingTask['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as WeddingTask['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <select
                    id="timeline"
                    value={newTask.timeline}
                    onChange={(e) => setNewTask({...newTask, timeline: e.target.value as WeddingTask['timeline']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Object.entries(TIMELINE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  placeholder="Any additional notes or reminders..."
                  rows={2}
                  className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingTask(null);
                  setNewTask({
                    title: '',
                    description: '',
                    category: 'other',
                    priority: 'medium',
                    timeline: '6months',
                    dueDate: '',
                    completed: false,
                    notes: ''
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                disabled={!newTask.title.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {editingTask ? 'Update' : 'Add'} Task
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}