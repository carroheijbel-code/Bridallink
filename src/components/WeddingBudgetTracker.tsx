import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  Heart,
  Download,
  Edit,
  Calendar,
  PieChart,
  Calculator
} from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  isEstimate: boolean;
}

interface BudgetCategory {
  name: string;
  icon: string;
  suggested: number; // percentage of total budget
  color: string;
}

const WEDDING_CATEGORIES: BudgetCategory[] = [
  { name: 'Venue & Reception', icon: '🏰', suggested: 40, color: 'bg-rose-500' },
  { name: 'Catering & Bar', icon: '🍽️', suggested: 25, color: 'bg-amber-500' },
  { name: 'Photography & Video', icon: '📸', suggested: 10, color: 'bg-purple-500' },
  { name: 'Wedding Dress & Attire', icon: '👗', suggested: 8, color: 'bg-pink-500' },
  { name: 'Flowers & Decorations', icon: '💐', suggested: 8, color: 'bg-green-500' },
  { name: 'Music & Entertainment', icon: '🎵', suggested: 5, color: 'bg-blue-500' },
  { name: 'Wedding Rings', icon: '💍', suggested: 3, color: 'bg-yellow-500' },
  { name: 'Transportation', icon: '🚗', suggested: 3, color: 'bg-indigo-500' },
  { name: 'Stationery & Invites', icon: '💌', suggested: 2, color: 'bg-rose-400' },
  { name: 'Beauty & Spa', icon: '💄', suggested: 2, color: 'bg-pink-400' },
  { name: 'Wedding Favors & Gifts', icon: '🎁', suggested: 2, color: 'bg-purple-400' },
  { name: 'Honeymoon', icon: '🌴', suggested: 15, color: 'bg-teal-500' },
  { name: 'Miscellaneous', icon: '📝', suggested: 5, color: 'bg-gray-500' }
];

export default function WeddingBudgetTracker() {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState<boolean>(false);
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState<boolean>(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: '',
    vendor: '',
    isEstimate: false
  });
  const [newBudget, setNewBudget] = useState<string>('');
  const [weddingDate, setWeddingDate] = useState<string>('');

  // Load data from localStorage
  useEffect(() => {
    try {
      const savedBudget = localStorage.getItem('weddingBudget');
      const savedExpenses = localStorage.getItem('weddingExpenses');
      const savedWeddingDate = localStorage.getItem('weddingDate');
      
      if (savedBudget) {
        setTotalBudget(parseFloat(savedBudget));
        setNewBudget(savedBudget);
      }
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
      if (savedWeddingDate) {
        setWeddingDate(savedWeddingDate);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weddingBudget', totalBudget.toString());
      localStorage.setItem('weddingExpenses', JSON.stringify(expenses));
      if (weddingDate) {
        localStorage.setItem('weddingDate', weddingDate);
      }
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  }, [totalBudget, expenses, weddingDate]);

  // Calculate spending metrics
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Calculate spending by category
  const categorySpending = WEDDING_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category.name);
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgeted = totalBudget * (category.suggested / 100);
    const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;
    
    return {
      ...category,
      spent,
      budgeted,
      remaining: budgeted - spent,
      percentage: Math.min(percentage, 100),
      isOverBudget: spent > budgeted
    };
  });

  // Days until wedding
  const daysUntilWedding = weddingDate ? 
    Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date().toISOString().split('T')[0],
        vendor: newExpense.vendor || undefined,
        isEstimate: newExpense.isEstimate
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({ category: '', description: '', amount: '', vendor: '', isEstimate: false });
      setShowAddExpense(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleSetBudget = () => {
    if (newBudget) {
      setTotalBudget(parseFloat(newBudget));
      setShowBudgetSetup(false);
    }
  };

  const exportBudgetData = () => {
    const data = {
      totalBudget,
      totalSpent,
      remainingBudget,
      weddingDate,
      expenses,
      categoryBreakdown: categorySpending
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-budget.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-3xl text-amber-800">Wedding Budget Tracker</h1>
        <p className="text-amber-700">Keep track of your wedding expenses and stay on budget</p>
        
        {daysUntilWedding !== null && (
          <div className="bg-rose-50 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="h-5 w-5 text-rose-600" />
              <span className="text-rose-800">
                {daysUntilWedding > 0 ? `${daysUntilWedding} days until your wedding!` : 'Your wedding is today! 🎉'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => setShowBudgetSetup(true)}
          variant="outline"
          className="border-amber-200 text-amber-800 hover:bg-amber-50"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {totalBudget > 0 ? 'Update Budget' : 'Set Budget'}
        </Button>
        
        <Button 
          onClick={() => setShowAddExpense(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
        
        <Button 
          onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
          variant="outline"
          className="border-purple-200 text-purple-800 hover:bg-purple-50"
        >
          <PieChart className="h-4 w-4 mr-2" />
          Category Breakdown
        </Button>
        
        <Button 
          onClick={exportBudgetData}
          variant="outline"
          className="border-gray-200 text-gray-800 hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Total Budget</span>
            </div>
            <div className="text-2xl text-blue-800">£{totalBudget.toLocaleString()}</div>
            {totalBudget === 0 && (
              <p className="text-xs text-blue-600">Click "Set Budget" to start</p>
            )}
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700">Total Spent</span>
            </div>
            <div className="text-2xl text-red-800">£{totalSpent.toLocaleString()}</div>
            {totalBudget > 0 && (
              <>
                <Progress value={budgetPercentage} className="w-full h-2" />
                <p className="text-xs text-red-600">
                  {budgetPercentage.toFixed(1)}% of budget used
                </p>
              </>
            )}
          </div>
        </Card>
        
        <Card className={`p-6 bg-gradient-to-br ${remainingBudget >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className={`h-5 w-5 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ${remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`}>Remaining</span>
            </div>
            <div className={`text-2xl ${remainingBudget >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              £{Math.abs(remainingBudget).toLocaleString()}
            </div>
            {remainingBudget < 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600">Over budget!</span>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-purple-700">Total Expenses</span>
            </div>
            <div className="text-2xl text-purple-800">{expenses.length}</div>
            <p className="text-xs text-purple-600">
              {expenses.filter(e => e.isEstimate).length} estimates
            </p>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {showCategoryBreakdown && (
        <Card className="p-6">
          <h3 className="text-xl text-amber-800 mb-6">Budget by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySpending.map((category) => (
              <div key={category.name} className="bg-rose-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm text-amber-800">{category.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-600">
                        £{category.spent.toLocaleString()} / £{category.budgeted.toLocaleString()}
                      </span>
                      {category.isOverBudget && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Over Budget</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Progress value={category.percentage} className="w-full h-2 mb-2" />
                <div className="text-xs text-amber-600">
                  {category.remaining >= 0 
                    ? `£${category.remaining.toLocaleString()} remaining`
                    : `£${Math.abs(category.remaining).toLocaleString()} over budget`
                  }
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Wedding Budget Tips (shown when no budget is set) */}
      {totalBudget === 0 && (
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-rose-50">
          <h3 className="text-xl text-amber-800 mb-4">💡 Wedding Budget Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-amber-800 mb-3">Average UK Wedding Costs:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• <strong>Budget Wedding:</strong> £8,000 - £15,000</li>
                <li>• <strong>Mid-range Wedding:</strong> £15,000 - £25,000</li>
                <li>• <strong>Luxury Wedding:</strong> £25,000 - £50,000+</li>
                <li>• <strong>Average in 2024:</strong> £20,000 - £30,000</li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-800 mb-3">Budget Allocation Guidelines:</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• <strong>Venue & Catering:</strong> 65% of budget</li>
                <li>• <strong>Photography:</strong> 10% of budget</li>
                <li>• <strong>Attire & Beauty:</strong> 10% of budget</li>
                <li>• <strong>Flowers & Decor:</strong> 8% of budget</li>
                <li>• <strong>Music & Entertainment:</strong> 5% of budget</li>
                <li>• <strong>Miscellaneous:</strong> 2% buffer</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Expenses */}
      <Card className="p-6">
        <h3 className="text-xl text-amber-800 mb-6">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-rose-200 mb-4">💰</div>
            <p className="text-amber-600 mb-4">No expenses added yet</p>
            <p className="text-sm text-amber-500 mb-6">
              Start tracking your wedding expenses to stay on budget
            </p>
            <Button 
              onClick={() => setShowAddExpense(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Add Your First Expense
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.slice().reverse().slice(0, 10).map((expense) => {
              const category = WEDDING_CATEGORIES.find(cat => cat.name === expense.category);
              return (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{category?.icon || '📝'}</span>
                    <div>
                      <div className="text-amber-800">{expense.description}</div>
                      <div className="text-sm text-amber-600 flex items-center gap-2 flex-wrap">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>{expense.date}</span>
                        {expense.vendor && (
                          <>
                            <span>•</span>
                            <span>{expense.vendor}</span>
                          </>
                        )}
                        {expense.isEstimate && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Estimate</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-800">£{expense.amount.toLocaleString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {expenses.length > 10 && (
              <div className="text-center pt-4">
                <p className="text-amber-600">Showing latest 10 expenses ({expenses.length} total)</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Budget Setup Modal */}
      {showBudgetSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl text-amber-800">Set Your Wedding Budget</h3>
                <p className="text-amber-600">How much are you planning to spend on your wedding?</p>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Total Wedding Budget (£)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="e.g. 25000"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Wedding Date (Optional)</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs text-amber-700">
                  💡 <strong>Tip:</strong> The average UK wedding costs £20,000-30,000. 
                  We'll help you allocate your budget across different categories based on industry standards.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBudgetSetup(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSetBudget}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                  disabled={!newBudget}
                >
                  Set Budget
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-rose-100 to-amber-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl text-amber-800">Add New Expense</h3>
                <p className="text-amber-600">Record a wedding-related expense</p>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Select category</option>
                  {WEDDING_CATEGORIES.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="e.g. Venue deposit, Wedding dress, Flowers"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm text-amber-700 mb-2">Vendor (Optional)</label>
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="e.g. The Royal Oak, David's Bridal"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEstimate"
                  checked={newExpense.isEstimate}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, isEstimate: e.target.checked }))}
                  className="rounded border-rose-200"
                />
                <label htmlFor="isEstimate" className="text-sm text-amber-700">
                  This is an estimate
                </label>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddExpense}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                  disabled={!newExpense.category || !newExpense.description || !newExpense.amount}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}