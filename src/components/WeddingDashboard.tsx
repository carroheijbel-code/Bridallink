import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Calendar,
  DollarSign,
  Users,
  CheckSquare,
  Heart,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
  MapPin,
  Camera,
  Flower,
  Music,
  Car,
  Gift,
  Sun,
  Cloud,
  ArrowRight,
  Plus,
  FileText,
  Globe
} from 'lucide-react';

interface DashboardData {
  weddingDate: string | null;
  totalBudget: number;
  totalSpent: number;
  guestCount: number;
  rsvpCount: number;
  tasksCompleted: number;
  totalTasks: number;
  expenses: any[];
  timelineTasks: any[];
}

export default function WeddingDashboard({ onNavigateToSection }: { onNavigateToSection: (section: string) => void }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    weddingDate: null,
    totalBudget: 0,
    totalSpent: 0,
    guestCount: 0,
    rsvpCount: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    expenses: [],
    timelineTasks: []
  });

  // Load data from localStorage
  useEffect(() => {
    try {
      const weddingDate = localStorage.getItem('weddingDate');
      const totalBudget = parseFloat(localStorage.getItem('weddingBudget') || '0');
      const expenses = JSON.parse(localStorage.getItem('weddingExpenses') || '[]');
      const guests = JSON.parse(localStorage.getItem('guests') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const timelineTasks = JSON.parse(localStorage.getItem('weddingTimelineTasks') || '[]');
      
      const totalSpent = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      const rsvpCount = guests.filter((guest: any) => guest.status === 'accepted').length;
      const tasksCompleted = [...tasks, ...timelineTasks].filter((task: any) => task.completed || task.isCompleted).length;
      const totalTasksCount = tasks.length + timelineTasks.length;

      setDashboardData({
        weddingDate,
        totalBudget,
        totalSpent,
        guestCount: guests.length,
        rsvpCount,
        tasksCompleted,
        totalTasks: totalTasksCount,
        expenses,
        timelineTasks
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  // Calculate derived metrics
  const daysUntilWedding = dashboardData.weddingDate ? 
    Math.max(0, Math.ceil((new Date(dashboardData.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;
  
  const remainingBudget = dashboardData.totalBudget - dashboardData.totalSpent;
  const budgetPercentage = dashboardData.totalBudget > 0 ? (dashboardData.totalSpent / dashboardData.totalBudget) * 100 : 0;
  const taskCompletionPercentage = dashboardData.totalTasks > 0 ? (dashboardData.tasksCompleted / dashboardData.totalTasks) * 100 : 0;
  const rsvpPercentage = dashboardData.guestCount > 0 ? (dashboardData.rsvpCount / dashboardData.guestCount) * 100 : 0;

  // Get recent activities
  const recentExpenses = dashboardData.expenses.slice(-3).reverse();
  const urgentTasks = dashboardData.timelineTasks
    .filter((task: any) => !task.isCompleted && task.monthsBefore <= 1)
    .slice(0, 3);

  // Determine overall planning health
  const getPlanningHealth = () => {
    if (!dashboardData.weddingDate) return { status: 'Not Started', color: 'text-gray-600', score: 0 };
    
    let score = 0;
    if (dashboardData.totalBudget > 0) score += 20;
    if (dashboardData.guestCount > 0) score += 20;
    if (taskCompletionPercentage > 25) score += 20;
    if (dashboardData.totalSpent > 0) score += 20;
    if (rsvpPercentage > 50) score += 20;

    if (score >= 80) return { status: 'On Track', color: 'text-green-600', score };
    if (score >= 60) return { status: 'Good Progress', color: 'text-blue-600', score };
    if (score >= 40) return { status: 'Getting Started', color: 'text-yellow-600', score };
    return { status: 'Needs Attention', color: 'text-red-600', score };
  };

  const planningHealth = getPlanningHealth();

  // Quick actions based on current state
  const getRecommendedActions = () => {
    const actions = [];
    
    if (!dashboardData.weddingDate) {
      actions.push({ text: 'Set your wedding date', section: 'timeline', priority: 'high' });
    }
    if (dashboardData.totalBudget === 0) {
      actions.push({ text: 'Set up your wedding budget', section: 'budget', priority: 'high' });
    }
    if (dashboardData.guestCount === 0) {
      actions.push({ text: 'Add guests to your list', section: 'guests', priority: 'medium' });
    }
    if (taskCompletionPercentage < 25) {
      actions.push({ text: 'Start completing planning tasks', section: 'tasks', priority: 'medium' });
    }
    if (dashboardData.guestCount > 0 && dashboardData.guestCount >= 20) {
      actions.push({ text: 'Plan your seating arrangement', section: 'seating', priority: 'medium' });
    }
    if (dashboardData.weddingDate && !localStorage.getItem('weddingWebsite')) {
      actions.push({ text: 'Create your wedding website', section: 'website', priority: 'low' });
    }
    if (rsvpPercentage < 50 && dashboardData.guestCount > 0) {
      actions.push({ text: 'Follow up on RSVPs', section: 'guests', priority: 'low' });
    }

    return actions.slice(0, 4);
  };

  const recommendedActions = getRecommendedActions();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Wedding Dashboard</h1>
        <p className="text-amber-700">Your wedding planning at a glance</p>

        {daysUntilWedding !== null && (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-4xl text-rose-600 mb-2">{daysUntilWedding}</div>
              <div className="text-rose-800">
                {daysUntilWedding === 0 ? 'Today is your wedding day! 🎉' :
                 daysUntilWedding === 1 ? 'Tomorrow is your wedding day! 💕' :
                 `Days until your wedding`}
              </div>
              {dashboardData.weddingDate && (
                <div className="text-sm text-rose-600 mt-1">
                  {new Date(dashboardData.weddingDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Planning Health Score */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg text-amber-800">Planning Progress</h3>
            <p className="text-sm text-amber-600">Overall wedding planning health</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl ${planningHealth.color}`}>{planningHealth.status}</div>
            <div className="text-sm text-gray-600">{planningHealth.score}/100</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={planningHealth.score} className="w-full h-3" />
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('budget')}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <DollarSign className="h-6 w-6 text-green-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600">Budget</h3>
            <div className="space-y-1">
              <div className="text-2xl text-gray-800">£{dashboardData.totalBudget.toLocaleString()}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Spent: £{dashboardData.totalSpent.toLocaleString()}</div>
                {budgetPercentage > 0 && (
                  <Badge className={`text-xs ${budgetPercentage > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {budgetPercentage.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </div>
            {dashboardData.totalBudget > 0 && (
              <Progress value={Math.min(budgetPercentage, 100)} className="w-full h-1" />
            )}
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('guests')}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Users className="h-6 w-6 text-blue-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600">Guests</h3>
            <div className="space-y-1">
              <div className="text-2xl text-gray-800">{dashboardData.guestCount}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">RSVP'd: {dashboardData.rsvpCount}</div>
                {dashboardData.guestCount > 0 && (
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {rsvpPercentage.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </div>
            {dashboardData.guestCount > 0 && (
              <Progress value={rsvpPercentage} className="w-full h-1" />
            )}
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('tasks')}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CheckSquare className="h-6 w-6 text-purple-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600">Tasks</h3>
            <div className="space-y-1">
              <div className="text-2xl text-gray-800">{dashboardData.tasksCompleted}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">of {dashboardData.totalTasks} total</div>
                {dashboardData.totalTasks > 0 && (
                  <Badge className="text-xs bg-purple-100 text-purple-800">
                    {taskCompletionPercentage.toFixed(0)}%
                  </Badge>
                )}
              </div>
            </div>
            {dashboardData.totalTasks > 0 && (
              <Progress value={taskCompletionPercentage} className="w-full h-1" />
            )}
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('timeline')}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Calendar className="h-6 w-6 text-rose-600" />
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm text-gray-600">Timeline</h3>
            <div className="space-y-1">
              <div className="text-2xl text-gray-800">{urgentTasks.length}</div>
              <div className="text-sm text-gray-600">Urgent tasks</div>
            </div>
            {urgentTasks.length > 0 && (
              <Badge className="bg-orange-100 text-orange-800 text-xs">
                Needs attention
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      {recommendedActions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg text-amber-800 mb-4">Recommended Next Steps</h3>
          <div className="space-y-3">
            {recommendedActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    action.priority === 'high' ? 'bg-red-500' : 
                    action.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-amber-800">{action.text}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => onNavigateToSection(action.section)}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Go
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('documents')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Documents</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600">Store contracts & receipts</div>
              <div className="text-xs text-blue-600">Stay organized</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('website')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Wedding Website</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-sm text-gray-600">Share details with guests</div>
              <div className="text-xs text-purple-600">Beautiful & mobile-friendly</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('weather')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Weather Forecast</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-sm text-gray-600">Plan for wedding day weather</div>
              <div className="text-xs text-yellow-600">Get recommendations</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('gifts')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Gift Registry</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-pink-500" />
            <div>
              <div className="text-sm text-gray-600">Track gifts & thank you notes</div>
              <div className="text-xs text-pink-600">Stay grateful</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('music')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Music Playlist</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-indigo-500" />
            <div>
              <div className="text-sm text-gray-600">Organize ceremony & party music</div>
              <div className="text-xs text-indigo-600">Perfect soundtrack</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigateToSection('seating')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Seating Planner</h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-sm text-gray-600">Design table arrangements</div>
              <div className="text-xs text-green-600">Visual planning tool</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Recent Expenses</h3>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onNavigateToSection('budget')}
            >
              View All
            </Button>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No expenses recorded yet</p>
              <Button 
                size="sm" 
                onClick={() => onNavigateToSection('budget')}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                  <div>
                    <div className="text-sm text-amber-800">{expense.description}</div>
                    <div className="text-xs text-amber-600">{expense.category}</div>
                  </div>
                  <div className="text-sm text-amber-800">£{expense.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Urgent Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-amber-800">Urgent Tasks</h3>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onNavigateToSection('timeline')}
            >
              View All
            </Button>
          </div>
          {urgentTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No urgent tasks</p>
              <div className="text-sm text-green-600">You're all caught up! 🎉</div>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentTasks.map((task: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-sm text-amber-800">{task.title}</div>
                      <div className="text-xs text-orange-600">
                        {task.monthsBefore === 0 ? 'This month' : `${task.monthsBefore} months before`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Weather & Final Tips (if wedding is soon) */}
      {daysUntilWedding !== null && daysUntilWedding <= 14 && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-lg text-amber-800 mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Final Wedding Preparations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-amber-700 mb-2">This Week's Priorities:</h4>
              <ul className="text-sm space-y-1">
                <li>• Confirm final guest count with caterer</li>
                <li>• Pick up wedding dress and accessories</li>
                <li>• Confirm all vendor arrival times</li>
                <li>• Prepare wedding day emergency kit</li>
                <li>• Delegate tasks to wedding party</li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-700 mb-2">Don't Forget:</h4>
              <ul className="text-sm space-y-1">
                <li>• Marriage license and rings</li>
                <li>• Vendor contact numbers</li>
                <li>• Wedding day timeline for everyone</li>
                <li>• Backup plans for outdoor elements</li>
                <li>• Relax and enjoy your special day! 💕</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}