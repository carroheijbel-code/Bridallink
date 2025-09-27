import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertTriangle,
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Heart,
  Camera,
  Music,
  Flower,
  Car,
  Users,
  Gift,
  Baby
} from 'lucide-react';

interface TimelineTask {
  id: string;
  title: string;
  description: string;
  category: 'venue' | 'catering' | 'photography' | 'attire' | 'flowers' | 'music' | 'legal' | 'planning' | 'beauty' | 'transportation' | 'childcare';
  monthsBefore: number;
  weeksBefore: number;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  estimatedCost?: string;
  notes?: string;
}

interface TimelineCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const TIMELINE_CATEGORIES: Record<string, TimelineCategory> = {
  venue: { name: 'Venue & Reception', icon: <MapPin className="h-4 w-4" />, color: 'bg-purple-500' },
  catering: { name: 'Catering', icon: <Gift className="h-4 w-4" />, color: 'bg-orange-500' },
  photography: { name: 'Photography', icon: <Camera className="h-4 w-4" />, color: 'bg-blue-500' },
  attire: { name: 'Attire & Beauty', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-500' },
  flowers: { name: 'Flowers & Decor', icon: <Flower className="h-4 w-4" />, color: 'bg-green-500' },
  music: { name: 'Music & Entertainment', icon: <Music className="h-4 w-4" />, color: 'bg-indigo-500' },
  legal: { name: 'Legal & Documents', icon: <FileText className="h-4 w-4" />, color: 'bg-gray-500' },
  planning: { name: 'Planning', icon: <Calendar className="h-4 w-4" />, color: 'bg-rose-500' },
  beauty: { name: 'Beauty & Spa', icon: <Star className="h-4 w-4" />, color: 'bg-yellow-500' },
  transportation: { name: 'Transportation', icon: <Car className="h-4 w-4" />, color: 'bg-teal-500' },
  childcare: { name: 'Childcare & Family', icon: <Baby className="h-4 w-4" />, color: 'bg-cyan-500' }
};

const DEFAULT_TIMELINE_TASKS: TimelineTask[] = [
  // 12+ Months Before
  { id: '1', title: 'Set Wedding Date', description: 'Choose your special day and notify close family', category: 'planning', monthsBefore: 12, weeksBefore: 0, priority: 'high', isCompleted: false },
  { id: '2', title: 'Create Wedding Budget', description: 'Determine total budget and allocate to categories', category: 'planning', monthsBefore: 12, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£0' },
  { id: '3', title: 'Book Venue', description: 'Research and book ceremony and reception venues', category: 'venue', monthsBefore: 12, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£8,000-15,000' },
  { id: '4', title: 'Hire Wedding Photographer', description: 'Research photographers and book for the day', category: 'photography', monthsBefore: 11, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£1,500-3,000' },
  { id: '5', title: 'Send Save the Dates', description: 'Let guests know to save your wedding date', category: 'planning', monthsBefore: 10, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£100-300' },

  // 9-6 Months Before
  { id: '6', title: 'Choose Wedding Dress', description: 'Shop for and order your wedding dress', category: 'attire', monthsBefore: 9, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£800-2,000' },
  { id: '7', title: 'Book Catering', description: 'Choose caterer and finalize menu', category: 'catering', monthsBefore: 8, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£3,000-6,000' },
  { id: '8', title: 'Book Music/DJ', description: 'Hire band or DJ for ceremony and reception', category: 'music', monthsBefore: 8, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£500-1,500' },
  { id: '9', title: 'Order Wedding Rings', description: 'Choose and order wedding bands', category: 'attire', monthsBefore: 7, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£500-2,000' },
  { id: '10', title: 'Book Florist', description: 'Choose flowers for bouquet, arrangements, and decorations', category: 'flowers', monthsBefore: 6, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£400-800' },

  // 3-6 Months Before
  { id: '11', title: 'Send Wedding Invitations', description: 'Finalize guest list and send invitations', category: 'planning', monthsBefore: 3, weeksBefore: 0, priority: 'high', isCompleted: false, estimatedCost: '£150-400' },
  { id: '12', title: 'Book Transportation', description: 'Arrange transport for wedding day', category: 'transportation', monthsBefore: 3, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£200-600' },
  { id: '13', title: 'Arrange Accommodations', description: 'Book hotels for out-of-town guests', category: 'planning', monthsBefore: 4, weeksBefore: 0, priority: 'low', isCompleted: false },
  { id: '14', title: 'Plan Hen/Stag Parties', description: 'Organize bachelor/bachelorette celebrations', category: 'planning', monthsBefore: 3, weeksBefore: 0, priority: 'low', isCompleted: false },
  { id: '24', title: 'Book Nanny/Childcare', description: 'Arrange professional childcare for children during the wedding', category: 'childcare', monthsBefore: 4, weeksBefore: 0, priority: 'medium', isCompleted: false, estimatedCost: '£150-400' },

  // 1-2 Months Before
  { id: '15', title: 'Final Dress Fitting', description: 'Final alterations and fitting for wedding dress', category: 'attire', monthsBefore: 1, weeksBefore: 0, priority: 'high', isCompleted: false },
  { id: '16', title: 'Confirm All Vendors', description: 'Reconfirm details with all wedding vendors', category: 'planning', monthsBefore: 1, weeksBefore: 0, priority: 'high', isCompleted: false },
  { id: '17', title: 'Create Seating Plan', description: 'Finalize seating arrangements for reception', category: 'planning', monthsBefore: 1, weeksBefore: 2, priority: 'medium', isCompleted: false },
  { id: '18', title: 'Marriage License', description: 'Obtain marriage license from registry office', category: 'legal', monthsBefore: 1, weeksBefore: 0, priority: 'high', isCompleted: false },

  // 1-2 Weeks Before
  { id: '19', title: 'Rehearsal Dinner', description: 'Plan and host wedding rehearsal dinner', category: 'planning', monthsBefore: 0, weeksBefore: 1, priority: 'medium', isCompleted: false },
  { id: '20', title: 'Beauty Treatments', description: 'Schedule hair and makeup trials, manicure, etc.', category: 'beauty', monthsBefore: 0, weeksBefore: 2, priority: 'medium', isCompleted: false, estimatedCost: '£200-500' },
  { id: '21', title: 'Pack for Honeymoon', description: 'Prepare and pack for your honeymoon trip', category: 'planning', monthsBefore: 0, weeksBefore: 1, priority: 'low', isCompleted: false },

  // Wedding Week
  { id: '22', title: 'Confirm Final Numbers', description: 'Give final guest count to caterer and venue', category: 'catering', monthsBefore: 0, weeksBefore: 1, priority: 'high', isCompleted: false },
  { id: '23', title: 'Prepare Wedding Day Emergency Kit', description: 'Pack emergency items and backup supplies', category: 'planning', monthsBefore: 0, weeksBefore: 1, priority: 'medium', isCompleted: false },
];

export default function WeddingTimeline() {
  const [weddingDate, setWeddingDate] = useState<string>('');
  const [timelineTasks, setTimelineTasks] = useState<TimelineTask[]>(DEFAULT_TIMELINE_TASKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedWeddingDate = localStorage.getItem('weddingDate');
      const savedTimelineTasks = localStorage.getItem('weddingTimelineTasks');
      
      if (savedWeddingDate) {
        setWeddingDate(savedWeddingDate);
      }
      if (savedTimelineTasks) {
        setTimelineTasks(JSON.parse(savedTimelineTasks));
      }
    } catch (error) {
      console.error('Error loading timeline data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      if (weddingDate) {
        localStorage.setItem('weddingDate', weddingDate);
      }
      localStorage.setItem('weddingTimelineTasks', JSON.stringify(timelineTasks));
    } catch (error) {
      console.error('Error saving timeline data:', error);
    }
  }, [weddingDate, timelineTasks]);

  const toggleTaskCompletion = (taskId: string) => {
    setTimelineTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  // Calculate timeline metrics
  const totalTasks = timelineTasks.length;
  const completedTasks = timelineTasks.filter(task => task.isCompleted).length;
  const completionPercentage = (completedTasks / totalTasks) * 100;

  // Get current timeline status
  const getTaskDueDate = (task: TimelineTask) => {
    if (!weddingDate) return null;
    
    const wedding = new Date(weddingDate);
    const dueDate = new Date(wedding);
    
    if (task.monthsBefore > 0) {
      dueDate.setMonth(wedding.getMonth() - task.monthsBefore);
    }
    if (task.weeksBefore > 0) {
      dueDate.setDate(wedding.getDate() - (task.weeksBefore * 7));
    }
    
    return dueDate;
  };

  const getTaskStatus = (task: TimelineTask) => {
    const dueDate = getTaskDueDate(task);
    if (!dueDate) return 'pending';
    
    const now = new Date();
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (task.isCompleted) return 'completed';
    if (daysDifference < 0) return 'overdue';
    if (daysDifference <= 7) return 'urgent';
    if (daysDifference <= 30) return 'upcoming';
    return 'future';
  };

  // Filter tasks
  const filteredTasks = timelineTasks
    .filter(task => selectedCategory === 'all' || task.category === selectedCategory)
    .filter(task => showCompleted || !task.isCompleted)
    .sort((a, b) => {
      // Sort by months before (desc), then weeks before (desc), then priority
      if (a.monthsBefore !== b.monthsBefore) {
        return b.monthsBefore - a.monthsBefore;
      }
      if (a.weeksBefore !== b.weeksBefore) {
        return b.weeksBefore - a.weeksBefore;
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  // Group tasks by timeline period
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    let period = '';
    if (task.monthsBefore >= 12) period = '12+ Months Before';
    else if (task.monthsBefore >= 9) period = '9-11 Months Before';
    else if (task.monthsBefore >= 6) period = '6-8 Months Before';
    else if (task.monthsBefore >= 3) period = '3-5 Months Before';
    else if (task.monthsBefore >= 1) period = '1-2 Months Before';
    else period = 'Wedding Month';

    if (!groups[period]) groups[period] = [];
    groups[period].push(task);
    return groups;
  }, {} as Record<string, TimelineTask[]>);

  const daysUntilWedding = weddingDate ? 
    Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Wedding Timeline</h1>
        <p className="text-amber-700">Stay organized with your wedding planning schedule</p>

        {!weddingDate && (
          <Card className="p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg text-amber-800">Set Your Wedding Date</h3>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-amber-600">
                Setting your wedding date will help us show you exactly when to complete each task.
              </p>
            </div>
          </Card>
        )}

        {daysUntilWedding !== null && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl text-rose-600">{daysUntilWedding > 0 ? daysUntilWedding : 0}</div>
                <div className="text-sm text-rose-700">Days Until Wedding</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-purple-600">{completedTasks}</div>
                <div className="text-sm text-purple-700">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-green-600">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-green-700">Planning Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={completionPercentage} className="w-full h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          All Categories
        </Button>
        {Object.entries(TIMELINE_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(key)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowCompleted(!showCompleted)}
          className="flex items-center gap-2"
        >
          {showCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </Button>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([period, tasks]) => (
          <div key={period} className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl text-amber-800">{period}</h2>
              <div className="h-px bg-amber-200 flex-1"></div>
              <Badge className="bg-amber-100 text-amber-800">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => {
                const status = getTaskStatus(task);
                const dueDate = getTaskDueDate(task);
                const category = TIMELINE_CATEGORIES[task.category];

                return (
                  <Card key={task.id} className={`p-6 ${task.isCompleted ? 'bg-green-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="p-1 mt-1"
                        >
                          {task.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-lg ${task.isCompleted ? 'line-through text-gray-500' : 'text-amber-800'}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {category.icon}
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {category.name}
                              </span>
                            </div>
                          </div>

                          <p className={`text-sm mb-3 ${task.isCompleted ? 'text-gray-400' : 'text-amber-700'}`}>
                            {task.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {dueDate && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>Due: {dueDate.toLocaleDateString()}</span>
                              </div>
                            )}

                            {task.estimatedCost && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <CreditCard className="h-4 w-4" />
                                <span>{task.estimatedCost}</span>
                              </div>
                            )}

                            <Badge
                              className={`text-xs ${
                                task.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.priority} priority
                            </Badge>

                            {status === 'overdue' && (
                              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Overdue
                              </Badge>
                            )}

                            {status === 'urgent' && (
                              <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Due Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">✅</div>
          <p className="text-gray-600 mb-4">No tasks match your current filters</p>
          <Button onClick={() => {
            setSelectedCategory('all');
            setShowCompleted(true);
          }}>
            Show All Tasks
          </Button>
        </div>
      )}

      {weddingDate && (
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-rose-50">
          <h3 className="text-lg text-amber-800 mb-4">💡 Planning Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-amber-700 mb-2">Priority Focus Areas:</h4>
              <ul className="text-sm space-y-1">
                <li>• Book venue and key vendors early (12+ months)</li>
                <li>• Send save-the-dates 10 months before</li>
                <li>• Order wedding dress 9 months before</li>
                <li>• Book childcare services if needed (4+ months)</li>
                <li>• Send invitations 3 months before</li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-700 mb-2">Budget Reminders:</h4>
              <ul className="text-sm space-y-1">
                <li>• Many vendors require deposits to secure dates</li>
                <li>• Book popular vendors early for better rates</li>
                <li>• Track expenses in your budget tracker</li>
                <li>• Leave 5-10% buffer for unexpected costs</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}